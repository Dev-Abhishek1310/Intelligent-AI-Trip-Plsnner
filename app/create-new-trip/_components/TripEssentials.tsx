"use client";

import React, { useState } from "react";
import { TripInfo } from "./ChatBox";
import {
  Languages,
  Plug,
  CloudSun,
  Landmark,
  Clock,
  Shirt,
  CheckCircle2,
  Circle,
} from "lucide-react";

type DestinationFacts = {
  currency: string;
  language: string;
  timezone: string;
  plug: string;
  weather: string;
  tip: string;
};

const DESTINATION_FACTS: Record<string, DestinationFacts> = {
  japan: {
    currency: "Japanese Yen (JPY)",
    language: "Japanese",
    timezone: "JST (UTC+9)",
    plug: "Type A / B · 100V",
    weather: "Mild spring, hot humid summer, cool autumn, cold winter",
    tip: "Cash is still king — carry yen for small shops and rural areas.",
  },
  france: {
    currency: "Euro (EUR)",
    language: "French",
    timezone: "CET (UTC+1)",
    plug: "Type E · 230V",
    weather: "Mild springs & autumns, warm summers, cool winters",
    tip: "A polite 'Bonjour' before asking anything goes a long way.",
  },
  italy: {
    currency: "Euro (EUR)",
    language: "Italian",
    timezone: "CET (UTC+1)",
    plug: "Type F / L · 230V",
    weather: "Hot summers, mild winters, sunny Mediterranean coast",
    tip: "Most museums close Mondays — plan indoor days accordingly.",
  },
  uk: {
    currency: "British Pound (GBP)",
    language: "English",
    timezone: "GMT (UTC+0)",
    plug: "Type G · 230V",
    weather: "Rainy and cool year-round — always carry a light jacket",
    tip: "Contactless cards work on all London public transport.",
  },
  indonesia: {
    currency: "Indonesian Rupiah (IDR)",
    language: "Indonesian / English",
    timezone: "WITA (UTC+8) in Bali",
    plug: "Type C / F · 230V",
    weather: "Tropical — wet season Nov–Mar, dry season Apr–Oct",
    tip: "Grab/Gojek is cheapest for getting around Bali.",
  },
  thailand: {
    currency: "Thai Baht (THB)",
    language: "Thai",
    timezone: "ICT (UTC+7)",
    plug: "Type A / C · 220V",
    weather: "Hot year-round; monsoon season May–Oct",
    tip: "Dress modestly when visiting temples — covered shoulders & knees.",
  },
  uae: {
    currency: "UAE Dirham (AED)",
    language: "Arabic / English",
    timezone: "GST (UTC+4)",
    plug: "Type G · 230V",
    weather: "Very hot summers (40°C+), mild winters",
    tip: "Fridays are the local weekend — some shops open late.",
  },
  usa: {
    currency: "US Dollar (USD)",
    language: "English",
    timezone: "Multiple (EST to PST)",
    plug: "Type A / B · 120V",
    weather: "Varies wildly by region and season",
    tip: "Tipping 15–20% at restaurants is expected, not optional.",
  },
  greece: {
    currency: "Euro (EUR)",
    language: "Greek",
    timezone: "EET (UTC+2)",
    plug: "Type F · 230V",
    weather: "Hot dry summers, mild wet winters",
    tip: "Ferries between islands book out fast in high season.",
  },
  switzerland: {
    currency: "Swiss Franc (CHF)",
    language: "German / French / Italian",
    timezone: "CET (UTC+1)",
    plug: "Type J · 230V",
    weather: "Alpine — cool summers, snowy winters in the mountains",
    tip: "The Swiss Travel Pass usually pays for itself in 3+ days.",
  },
  india: {
    currency: "Indian Rupee (INR)",
    language: "Hindi / English + regional",
    timezone: "IST (UTC+5:30)",
    plug: "Type D / M · 230V",
    weather: "Varies hugely — plan around monsoon (Jun–Sep)",
    tip: "UPI is everywhere; cash useful for smaller vendors.",
  },
};

function matchFacts(destination?: string): DestinationFacts | null {
  if (!destination) return null;
  const s = destination.toLowerCase();
  for (const key of Object.keys(DESTINATION_FACTS)) {
    if (s.includes(key)) return DESTINATION_FACTS[key];
  }
  // City-to-country shortcuts
  if (/tokyo|kyoto|osaka/.test(s)) return DESTINATION_FACTS.japan;
  if (/paris|nice|marseille/.test(s)) return DESTINATION_FACTS.france;
  if (/rome|milan|venice|florence/.test(s)) return DESTINATION_FACTS.italy;
  if (/london|manchester|edinburgh/.test(s)) return DESTINATION_FACTS.uk;
  if (/bali|jakarta/.test(s)) return DESTINATION_FACTS.indonesia;
  if (/bangkok|phuket|chiang mai/.test(s)) return DESTINATION_FACTS.thailand;
  if (/dubai|abu dhabi/.test(s)) return DESTINATION_FACTS.uae;
  if (/new york|san francisco|los angeles|chicago/.test(s))
    return DESTINATION_FACTS.usa;
  if (/santorini|athens|mykonos/.test(s)) return DESTINATION_FACTS.greece;
  if (/zurich|geneva|zermatt|interlaken/.test(s))
    return DESTINATION_FACTS.switzerland;
  if (/delhi|mumbai|bengaluru|goa|jaipur|kerala/.test(s))
    return DESTINATION_FACTS.india;
  return null;
}

function buildPackingList(trip: TripInfo): string[] {
  const base = [
    "Passport & travel docs",
    "Phone charger & power bank",
    "Comfortable walking shoes",
    "Toiletries & medications",
  ];

  const dest = (trip.destination || "").toLowerCase();
  const extras: string[] = [];

  if (/bali|thailand|dubai|singapore|goa/.test(dest)) {
    extras.push("Sunscreen SPF 50+", "Sunglasses & hat", "Light cotton clothes");
  }
  if (/switzerland|iceland|alps|norway|finland/.test(dest)) {
    extras.push("Thermal layers", "Warm jacket & gloves", "Waterproof boots");
  }
  if (/japan|korea|beijing/.test(dest)) {
    extras.push("Pocket wifi or SIM", "Slip-on shoes (shrines & temples)");
  }
  if (/paris|rome|london|new york/.test(dest)) {
    extras.push("Crossbody bag (pickpocket-safe)", "Umbrella");
  }

  const duration = parseInt(trip.duration || "0", 10);
  if (duration >= 5) extras.push("Laundry pouch / spare outfits");

  const budget = (trip.budget || "").toLowerCase();
  if (/luxury|high/.test(budget)) extras.push("Smart-casual outfit for nice dinners");

  return [...base, ...extras];
}

export default function TripEssentials({ trip }: { trip: TripInfo }) {
  const facts = matchFacts(trip.destination);
  const packing = buildPackingList(trip);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Trip Essentials</h3>

      {facts && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {trip.destination} Quick Facts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FactRow icon={Landmark} label="Currency" value={facts.currency} />
            <FactRow icon={Languages} label="Language" value={facts.language} />
            <FactRow icon={Clock} label="Timezone" value={facts.timezone} />
            <FactRow icon={Plug} label="Power" value={facts.plug} />
            <FactRow
              icon={CloudSun}
              label="Weather"
              value={facts.weather}
              wide
            />
          </div>
          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-gray-700">
            💡 <span className="font-medium">Local tip:</span> {facts.tip}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shirt className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-gray-700">
            Packing Checklist
          </h4>
          <span className="text-xs text-gray-500 ml-auto">
            {checked.size} / {packing.length} packed
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {packing.map((item) => {
            const isChecked = checked.has(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`flex items-center gap-2 p-2 border rounded-lg text-sm text-left transition ${isChecked
                    ? "bg-primary/5 border-primary/30 text-gray-500 line-through"
                    : "bg-white hover:border-primary/50"
                  }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className="truncate">{item}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FactRow({
  icon: Icon,
  label,
  value,
  wide,
}: {
  icon: any;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-2 p-2 border rounded-lg ${wide ? "sm:col-span-2" : ""
        }`}
    >
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] text-gray-500">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}