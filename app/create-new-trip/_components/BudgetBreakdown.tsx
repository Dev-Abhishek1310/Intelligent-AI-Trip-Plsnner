"use client";

import React from "react";
import { TripInfo } from "./ChatBox";
import { Hotel, MapPin, UtensilsCrossed, Car, Wallet } from "lucide-react";

type CurrencyInfo = { code: string; symbol: string; rate: number }; // rate = units per USD

// Approximate FX to USD. Values are illustrative — good enough for trip planning estimates.
const COUNTRY_CURRENCY: Record<string, CurrencyInfo> = {
  india: { code: "INR", symbol: "₹", rate: 83 },
  usa: { code: "USD", symbol: "$", rate: 1 },
  "united states": { code: "USD", symbol: "$", rate: 1 },
  uk: { code: "GBP", symbol: "£", rate: 0.79 },
  "united kingdom": { code: "GBP", symbol: "£", rate: 0.79 },
  england: { code: "GBP", symbol: "£", rate: 0.79 },
  france: { code: "EUR", symbol: "€", rate: 0.92 },
  germany: { code: "EUR", symbol: "€", rate: 0.92 },
  italy: { code: "EUR", symbol: "€", rate: 0.92 },
  spain: { code: "EUR", symbol: "€", rate: 0.92 },
  netherlands: { code: "EUR", symbol: "€", rate: 0.92 },
  greece: { code: "EUR", symbol: "€", rate: 0.92 },
  japan: { code: "JPY", symbol: "¥", rate: 150 },
  china: { code: "CNY", symbol: "¥", rate: 7.2 },
  australia: { code: "AUD", symbol: "A$", rate: 1.5 },
  canada: { code: "CAD", symbol: "C$", rate: 1.35 },
  uae: { code: "AED", symbol: "AED ", rate: 3.67 },
  "united arab emirates": { code: "AED", symbol: "AED ", rate: 3.67 },
  singapore: { code: "SGD", symbol: "S$", rate: 1.34 },
  thailand: { code: "THB", symbol: "฿", rate: 36 },
  indonesia: { code: "IDR", symbol: "Rp ", rate: 15800 },
  switzerland: { code: "CHF", symbol: "CHF ", rate: 0.88 },
};

const DEFAULT_CURRENCY: CurrencyInfo = { code: "USD", symbol: "$", rate: 1 };

// Indian cities often appear without the country — map major ones.
const CITY_COUNTRY: Record<string, string> = {
  "new delhi": "india", delhi: "india", mumbai: "india", bengaluru: "india",
  bangalore: "india", kolkata: "india", chennai: "india", hyderabad: "india",
  london: "uk", paris: "france", rome: "italy", milan: "italy",
  "new york": "usa", "san francisco": "usa", "los angeles": "usa", chicago: "usa",
  tokyo: "japan", kyoto: "japan", osaka: "japan",
  dubai: "uae", singapore: "singapore", bangkok: "thailand",
  bali: "indonesia", sydney: "australia", toronto: "canada",
  zurich: "switzerland", geneva: "switzerland",
};

function detectCurrency(origin?: string): CurrencyInfo {
  if (!origin) return DEFAULT_CURRENCY;
  const s = origin.toLowerCase();
  for (const key of Object.keys(COUNTRY_CURRENCY)) {
    if (s.includes(key)) return COUNTRY_CURRENCY[key];
  }
  for (const city of Object.keys(CITY_COUNTRY)) {
    if (s.includes(city)) return COUNTRY_CURRENCY[CITY_COUNTRY[city]];
  }
  return DEFAULT_CURRENCY;
}

function parseGroupSize(raw?: string): number {
  if (!raw) return 1;
  const match = raw.match(/\d+/g);
  if (!match) return 1;
  // "3 to 5 People" → take upper bound
  return Math.max(...match.map(Number));
}

function parseDuration(raw?: string): number {
  if (!raw) return 1;
  const match = raw.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

// Per-person, per-day base rate in USD, keyed loosely by the LLM's budget label.
function dailyUsdByTier(budget?: string): number {
  const b = (budget || "").toLowerCase();
  if (/luxury|high/.test(b)) return 400;
  if (/moderate|medium|mid/.test(b)) return 150;
  return 60; // cheap / low / budget
}

function fmt(n: number, c: CurrencyInfo): string {
  const rounded = Math.round(n);
  return `${c.symbol}${rounded.toLocaleString("en-US")}`;
}

// Category split (of the base daily allowance) — widely-accepted travel breakdown.
const SPLIT = {
  accommodation: 0.4,
  food: 0.2,
  activities: 0.25,
  transport: 0.15,
};

export default function BudgetBreakdown({ trip }: { trip: TripInfo }) {
  const currency = detectCurrency(trip.origin);
  const people = parseGroupSize(trip.group_size);
  const days = parseDuration(trip.duration);
  const dailyUsd = dailyUsdByTier(trip.budget);
  const totalUsd = dailyUsd * days * people;

  const toLocal = (usd: number) => usd * currency.rate;

  const categories = [
    {
      key: "accommodation",
      label: "Accommodation",
      icon: Hotel,
      color: "bg-blue-100 text-blue-600",
      usd: totalUsd * SPLIT.accommodation,
      note: `${days} night${days > 1 ? "s" : ""}`,
    },
    {
      key: "food",
      label: "Food & Dining",
      icon: UtensilsCrossed,
      color: "bg-orange-100 text-orange-600",
      usd: totalUsd * SPLIT.food,
      note: `~3 meals/day × ${people} ${people > 1 ? "people" : "person"}`,
    },
    {
      key: "activities",
      label: "Activities & Sights",
      icon: MapPin,
      color: "bg-green-100 text-green-600",
      usd: totalUsd * SPLIT.activities,
      note: "Tickets, tours, experiences",
    },
    {
      key: "transport",
      label: "Local Transport",
      icon: Car,
      color: "bg-purple-100 text-purple-600",
      usd: totalUsd * SPLIT.transport,
      note: "Taxis, metro, day trips",
    },
  ];

  const perDay = toLocal(dailyUsd) * people;
  const perPerson = toLocal(totalUsd) / people;

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Estimated Budget</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Converted to {currency.code} based on your origin ({trip.origin || "—"}).
        Estimates based on "{trip.budget}" tier for {people}{" "}
        {people > 1 ? "people" : "person"} across {days} day{days > 1 ? "s" : ""}.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center min-w-0">
          <div className="text-[11px] text-gray-600">Total Trip</div>
          <div className="text-base md:text-xl font-bold text-primary mt-1 truncate">
            {fmt(toLocal(totalUsd), currency)}
          </div>
          <div className="text-[10px] text-gray-500">{currency.code}</div>
        </div>
        <div className="bg-gray-50 border rounded-xl p-3 text-center min-w-0">
          <div className="text-[11px] text-gray-600">Per Day</div>
          <div className="text-base md:text-lg font-semibold mt-1 truncate">
            {fmt(perDay, currency)}
          </div>
          <div className="text-[10px] text-gray-500">group</div>
        </div>
        <div className="bg-gray-50 border rounded-xl p-3 text-center min-w-0">
          <div className="text-[11px] text-gray-600">Per Person</div>
          <div className="text-base md:text-lg font-semibold mt-1 truncate">
            {fmt(perPerson, currency)}
          </div>
          <div className="text-[10px] text-gray-500">{currency.code}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = Math.round(
            SPLIT[cat.key as keyof typeof SPLIT] * 100
          );
          const local = toLocal(cat.usd);
          return (
            <div
              key={cat.key}
              className="flex items-center gap-3 p-3 border rounded-xl"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cat.label}</span>
                  <span className="font-semibold">
                    {fmt(local, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{cat.note}</span>
                  <span className="text-xs text-gray-500">{pct}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        These are indicative estimates. Actual costs vary by season, bookings, and
        personal choices.
      </p>
    </div>
  );
}