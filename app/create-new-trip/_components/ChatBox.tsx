"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDays from "./SelectDays";
import InterestsUi from "./InterestsUi";
import PreferencesUi from "./PreferencesUi";
import SourceUi from "./SourceUi";
import DestinationUi from "./DestinationUi";
import FinalUi from "./FinalUi";
import SelectItineraryUi from "./SelectItineraryUi";
import { useMutation } from "convex/react";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary[]; // ✅ changed to array
  theme?: string;
  summary?: string;
};


export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitide: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit: string;
  activities: Activity[];
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const [tripOptions, setTripOptions] = useState<TripInfo[]>([]);
  const [savingSelection, setSavingSelection] = useState(false);
  const [tripId, setTripId] = useState<string>("");
  const { userDetail } = useUserDetail();
  const saveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { setTripDetailInfo } = useTripDetail();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seededRef = useRef(false);

  const onSend = async (input?: string) => {
    const text = input ?? userInput;
    if (!text.trim()) return;

    setLoading(true);
    const newMsg: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");

    try {
      const result = await axios.post("/api/aimodel", {
        messages: [...messages, newMsg],
        isFinal: isFinal,
      });

      console.log("Trip response:", JSON.stringify(result.data, null, 2));

      !isFinal &&
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result?.data?.resp || "No response",
            ui: result.data?.ui,
          },
        ]);

      // Single call: server returns `trip_plans` (3 full plans).
      // We cache them client-side; user picks one locally — no second API call.
      if (isFinal) {
        const plans: TripInfo[] = Array.isArray(result?.data?.trip_plans)
          ? result.data.trip_plans
          : result?.data?.trip_plan
          ? [result.data.trip_plan]
          : [];

        console.log("Final plans received:", plans.length, plans);

        if (plans.length > 0) {
          setTripOptions(plans);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: result?.data?.resp || "Pick an itinerary to continue.",
              ui: "selectItinerary",
            },
          ]);
        } else {
          console.warn("⚠️ No trip_plans in final response.", result?.data);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Sorry — I couldn't generate the itinerary options. Please try again.",
            },
          ]);
        }
      }
    } catch (error: any) {
      const detail =
        error?.response?.data?.error ||
        error?.response?.data?.resp ||
        error?.message ||
        "Could not fetch response.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${detail}` },
      ]);
    }

    setLoading(false);
  };

  const onSelectItinerary = async (index: number) => {
    const chosen = tripOptions[index];
    if (!chosen) return;

    setSavingSelection(true);
    try {
      setTripDetail(chosen);
      setTripDetailInfo(chosen);

      if (userDetail?._id) {
        const newTripId = uuidv4();
        await saveTripDetail({
          tripDetail: chosen,
          tripId: newTripId,
          uid: userDetail._id,
        });
        setTripId(newTripId);
      } else {
        console.warn("⚠️ Missing userDetail, skipping saveTripDetail.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great choice — ${chosen.theme || "your itinerary"} is ready.`,
          ui: "final",
        },
      ]);
    } catch (e) {
      console.error("Failed to save selected itinerary", e);
    } finally {
      setSavingSelection(false);
    }
  };

  const STEP_UIS = new Set([
    "source",
    "destination",
    "groupSize",
    "budget",
    "tripDuration",
    "interests",
    "preferences",
  ]);

  const RenderGenerativeUi = (ui: string, content: string, index: number) => {
    // Safeguard: if this step-UI already appeared in an earlier assistant message,
    // don't render it again (prevents duplicate question widgets if the LLM repeats a step).
    if (STEP_UIS.has(ui)) {
      const alreadyShown = messages
        .slice(0, index)
        .some((m) => m.role === "assistant" && m.ui === ui);
      if (alreadyShown) return null;
    }

    if (ui === "source") {
      return (
        <SourceUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "destination") {
      return (
        <DestinationUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "groupSize") {
      return (
        <GroupSizeUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "tripDuration") {
      return (
        <SelectDays
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "interests") {
      return (
        <InterestsUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "preferences") {
      return (
        <PreferencesUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "selectItinerary") {
      return (
        <SelectItineraryUi
          options={tripOptions}
          onSelect={onSelectItinerary}
          disabled={savingSelection}
        />
      );
    } else if (ui === "final") {
      return (
        <FinalUi
          viewTrip={() => {
            if (tripId) router.push(`/view-trip/${tripId}`);
          }}
          ready={Boolean(tripDetail && tripId)}
        />
      );
    }

    return null;
  };

  // On mount: clear any stale trip from a previous session so the right panel
  // doesn't show a trip the user didn't actually plan this time. If the page
  // was opened via /create-new-trip?destination=X (e.g. from Discover), seed
  // the chat locally so the destination step is already answered — no API
  // call, no redundant "Which city would you like to travel to?" question.
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    setTripDetailInfo(null);

    const preDestination = searchParams?.get("destination");
    if (preDestination) {
      setMessages([
        {
          role: "user",
          content: `I want to plan a trip to ${preDestination}.`,
        },
        {
          role: "assistant",
          content: `Great choice — ${preDestination}! Where will you be departing from?`,
          ui: "source",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    // Stage 1 signals "final" after all prefs are collected — that's our cue to
    // request the plan generation. We only want the FinalUi to render at the very
    // end (after the user picks an itinerary and it's saved), so we mark the
    // trigger message with a transitional ui and flip isFinal.
    if (lastMsg?.ui === "final" && !isFinal) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, ui: "generating" } : m
        )
      );
      setIsFinal(true);
      setUserInput("OK, Great!");
    }
  }, [messages, isFinal]);

  useEffect(() => {
    if (isFinal && userInput) {
      onSend();
    }
  }, [isFinal]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-[85vh] flex flex-col">
      {/* Empty State */}
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
            onSend(v);
          }}
        />
      )}

      {/* Messages */}
      <section ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div key={index} className="flex justify-end mt-2">
              <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={index} className="flex justify-start mt-2">
              <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "", msg.content, index)}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              <span className="text-sm text-gray-600">
                {isFinal
                  ? "Generating your 3 itinerary options… this can take up to a minute."
                  : "Thinking…"}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Input */}
      <section>
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Create a trip from Paris to New York"
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;