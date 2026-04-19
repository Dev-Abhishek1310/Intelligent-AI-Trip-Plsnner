import { NextRequest, NextResponse } from "next/server";

import { aj } from "@/lib/arcjet";

import { auth, currentUser } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";


const PROMPT = `
You are an AI Trip Planner Agent.  

Your task is to help the user plan a trip by asking **exactly one relevant trip-related question at a time**.  

⚠️ Very Important:
- You must **always return ONLY a valid JSON object**.  
- Never output explanations, commentary, or markdown.  
- Never include extra keys or fields outside the schema.  
- \`resp\` must always be a natural, conversational question for the user.  
- \`ui\` must always exactly match one of the allowed values.  

Ask about the following details in this strict order, one at a time:
1. Starting location (\`source\`)  
2. Destination city or country (\`destination\`)  
3. Group size (\`groupSize\`) → Solo, Couple, Family, Friends  
4. Budget (\`budget\`) → Low, Medium, High  
5. Trip duration (\`tripDuration\`) → number of days  
6. Travel interests (\`interests\`) → adventure, sightseeing, cultural, food, nightlife, relaxation  
7. Special requirements or preferences (\`preferences\`)  

Once all required details are collected, set \`ui\` to "final".  

---

### Schema (you must strictly follow this):
{
  "resp": "string — the exact question to ask the user",
  "ui": "source | destination | groupSize | budget | tripDuration | interests | preferences | final"
}

---

Rules:
- Always output only JSON, never text outside JSON.  
- Never ask multiple questions in one response.  
- Never invent new \`ui\` values.  
- If you are unsure, still return a valid JSON object with the best matching \`ui\`.
- **Never re-ask a question already answered**, even for clarification. Treat the user's first answer as final and move to the next unanswered step.
- **Never emit the same \`ui\` value twice in one conversation.** If \`groupSize\` (or any other) appeared in a prior assistant turn, move to the next step instead.
- **Treat any detail the user mentions proactively as already answered.** If the first user message says "I want to plan a trip to Paris", destination is already \`Paris\` — do NOT ask for destination; move to the next unanswered step (source, then groupSize, etc.).
- Before asking each step, scan ALL prior user messages for that info (city names → source/destination, numbers + "days" → tripDuration, group words like "family"/"solo" → groupSize, etc.). Skip any step already implied.
- If an answer looks ambiguous, accept it and proceed — do not ask a follow-up on the same topic.
`;

// Single call: generate 3 FULL distinct trip plans at once.
// The client caches them and picks one locally (no second API call needed).
const ALL_PLANS_PROMPT = `
You are an AI Trip Planner Agent.

All required trip details have been collected. Generate **exactly 3 distinct, complete trip plans** for the same origin, destination, duration, group size, and budget — so the user can choose one.

Use these three themes in order, and set each plan's "theme" field to match EXACTLY:
  1. "Adventure & Outdoors"  — active, outdoor, adrenaline
  2. "Culture & Cuisine"     — history, landmarks, museums, local food
  3. "Relaxed & Scenic"      — slower pace, scenic views, iconic sights

Each plan must have a clearly different set of hotels and activities (no repeating places across plans).

⚠️ Very Important:
- Return ONLY a valid JSON object matching the schema below.
- No markdown, no comments, no extra keys.
- Use "TBD" or 0 if data is missing.

### Schema:
{
  "trip_plans": [
    {
      "theme": "string",
      "summary": "string — one short sentence describing the vibe",
      "destination": "string",
      "duration": "string",
      "origin": "string",
      "budget": "string",
      "group_size": "string",
      "hotels": [
        {
          "hotel_name": "string",
          "hotel_address": "string",
          "price_per_night": "string",
          "hotel_image_url": "string",
          "geo_coordinates": { "latitude": number, "longitude": number },
          "rating": number,
          "description": "string"
        }
      ],
      "itinerary": [
        {
          "day": number,
          "day_plan": "string",
          "best_time_to_visit_day": "string",
          "activities": [
            {
              "place_name": "string",
              "place_details": "string",
              "place_image_url": "string",
              "geo_coordinates": { "latitude": number, "longitude": number },
              "place_address": "string",
              "ticket_pricing": "string",
              "time_travel_each_location": "string",
              "best_time_to_visit": "string"
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Top-level "trip_plans" array MUST have exactly 3 items in the theme order above.
- Every key must be present. No extra fields.
`;

type Message = {
  role: "user" | "assistant";
  content: string;
};


export async function POST(req: NextRequest) {
  const { messages, isFinal }: { messages: Message[]; isFinal: boolean } = await req.json();

  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "monthly" });

  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress ?? "",
    requested: isFinal ? 5 : 0,
  });

// @ts-ignore
if (decision?.reason?.remaining === 0 && !hasPremiumAccess) {
  return NextResponse.json({
    resp: "Your daily limit has been reached",
    ui: "limit",
  });
}




  try {
    const callModel = async () => {
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: isFinal ? ALL_PLANS_PROMPT : PROMPT },
          ...messages,
        ],
      });
      return completion.choices[0].message.content ?? "";
    };

    let raw = await callModel();
    console.log("[aimodel] raw:", JSON.stringify(raw).slice(0, 300));

    // Retry once if model returned nothing useful (free tier often flakes).
    if (!raw || !raw.trim() || raw.trim() === "{}") {
      console.warn("[aimodel] empty response, retrying once…");
      raw = await callModel();
      console.log("[aimodel] raw-retry:", JSON.stringify(raw).slice(0, 300));
    }

    let cleanMessage = raw
      .replace(/<\|.*?\|>/g, "")
      .replace(/```json\s*/gi, "")
      .replace(/```\s*$/g, "")
      .replace(/^(final\s*json|json|final|assistantfinal)[:\s]*/gi, "")
      .trim();

    // Extract JSON if wrapped
    const jsonMatch = cleanMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanMessage = jsonMatch[0];

    let content: any;
    try {
      content = JSON.parse(cleanMessage);
    } catch {
      content = { resp: cleanMessage || "", ui: "" };
    }

    const ALLOWED_UIS = [
      "source",
      "destination",
      "groupSize",
      "budget",
      "tripDuration",
      "interests",
      "preferences",
      "final",
    ];
    const UI_ALIASES: Record<string, string> = {
      source: "source",
      origin: "source",
      from: "source",
      starting: "source",
      startinglocation: "source",
      destination: "destination",
      dest: "destination",
      to: "destination",
      groupsize: "groupSize",
      group: "groupSize",
      travelers: "groupSize",
      people: "groupSize",
      budget: "budget",
      cost: "budget",
      tripduration: "tripDuration",
      duration: "tripDuration",
      days: "tripDuration",
      length: "tripDuration",
      interests: "interests",
      interest: "interests",
      activities: "interests",
      preferences: "preferences",
      preference: "preferences",
      requirements: "preferences",
      special: "preferences",
      final: "final",
    };

    // Normalize `ui`: lowercase/trim and map known synonyms to canonical values.
    if (typeof content.ui === "string") {
      const key = content.ui.toLowerCase().replace(/[\s_-]/g, "");
      content.ui = UI_ALIASES[key] ?? (ALLOWED_UIS.includes(content.ui) ? content.ui : "");
    } else {
      content.ui = "";
    }

    // Infer `ui` from the question text if the LLM omitted or mangled it.
    if (!content.ui && typeof content.resp === "string") {
      const r = content.resp.toLowerCase();
      if (/\b(budget|cheap|moderate|luxury|cost|expensive)\b/.test(r)) content.ui = "budget";
      else if (/\b(group|travel(ing|ling)?\s+with|solo|couple|family|friends|how many (people|travelers))\b/.test(r)) content.ui = "groupSize";
      else if (/\b(how many days|duration|how long|number of days|trip length)\b/.test(r)) content.ui = "tripDuration";
      else if (/\b(interest|sightseeing|adventure|cultural|nightlife|relaxation|what kind of (things|activities))\b/.test(r)) content.ui = "interests";
      else if (/\b(preference|special (requirement|need)|dietary|accessibility|kid-friendly|pet)\b/.test(r)) content.ui = "preferences";
      else if (/\b(depart|starting (point|location|city)|where (are|will) you (starting|leaving|departing))\b/.test(r)) content.ui = "source";
      else if (/\b(destination|where (do|would) you (want|like) to (go|travel)|which city|where to)\b/.test(r)) content.ui = "destination";
    }

    // Count only AI messages
const aiMessagesCount = messages.filter((msg: Message) => msg.role === "assistant").length;


if (isFinal) {
  // Normalize: accept { trip_plans: [...] } (expected) or legacy { trip_plan: {...} }.
  if (!Array.isArray(content?.trip_plans)) {
    if (content?.trip_plan) {
      content.trip_plans = [content.trip_plan];
    } else {
      content.trip_plans = [];
    }
  }
  content.resp = "I've prepared 3 itinerary options — pick the one you like best.";
  content.ui = "selectItinerary";
}


    // Remove any embedded UI hints in response
    if (typeof content.resp === "string") {
      content.resp = content.resp.replace(/ui\s*[:`]*\s*[a-zA-Z]+/gi, "").trim();
    }

    // Final fallback: if the model still gave us nothing, surface a friendly message
    // so the UI doesn't show an empty bubble.
    if (!isFinal && (!content.resp || !String(content.resp).trim())) {
      content.resp =
        "The AI model returned an empty response. Please rephrase your last message or try again.";
      content.ui = content.ui || "";
    }

    console.log("[aimodel] →", { ui: content.ui, resp: (content.resp ?? "").slice(0, 80) });

    return NextResponse.json(content);
  } catch (e: any) {
    console.error("[aimodel] error:", e);
    return NextResponse.json(
      { error: e.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}