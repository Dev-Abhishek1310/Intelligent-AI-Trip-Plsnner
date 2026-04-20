"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Bed,
  Calendar,
  Compass,
  MapPin,
  Plane,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import HeroVideoDialog from "../../components/magicui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const suggestions = [
  { title: "Explore Destinations", icon: <Compass className="text-blue-400 h-5 w-5" /> },
  { title: "Book a Flight", icon: <Plane className="text-green-500 h-5 w-5" /> },
  { title: "Plan a Weekend Trip", icon: <MapPin className="text-orange-500 h-5 w-5" /> },
  { title: "Discover Cultures", icon: <Sparkles className="text-yellow-600 h-5 w-5" /> },
];

type Tab = "ai" | "stays" | "flights" | "things";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "ai", label: "AI Planner", icon: <Sparkles className="w-4 h-4" /> },
  { key: "stays", label: "Stays", icon: <Bed className="w-4 h-4" /> },
  { key: "flights", label: "Flights", icon: <Plane className="w-4 h-4" /> },
  { key: "things", label: "Things to Do", icon: <Compass className="w-4 h-4" /> },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("ai");

  const [aiPrompt, setAiPrompt] = useState("");

  // Stays
  const [stayCity, setStayCity] = useState("");
  const [stayCheckIn, setStayCheckIn] = useState("");
  const [stayCheckOut, setStayCheckOut] = useState("");
  const [stayGuests, setStayGuests] = useState("2");

  // Flights
  const [flyFrom, setFlyFrom] = useState("");
  const [flyTo, setFlyTo] = useState("");
  const [flyDepart, setFlyDepart] = useState("");
  const [flyReturn, setFlyReturn] = useState("");

  // Things to Do
  const [thingsCity, setThingsCity] = useState("");

  const gotoAi = (seed?: string) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    const q = seed ?? aiPrompt;
    router.push(q ? `/create-new-trip?prompt=${encodeURIComponent(q)}` : "/create-new-trip");
  };

  const openStays = () => {
    const city = stayCity.trim();
    if (!city) return;
    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}${stayCheckIn ? `&checkin=${stayCheckIn}` : ""
      }${stayCheckOut ? `&checkout=${stayCheckOut}` : ""}&group_adults=${encodeURIComponent(
        stayGuests || "2"
      )}`;
    window.open(url, "_blank");
  };

  const openFlights = () => {
    const from = flyFrom.trim();
    const to = flyTo.trim();
    if (!from || !to) return;
    const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(
      `Flights from ${from} to ${to}${flyDepart ? ` on ${flyDepart}` : ""}${flyReturn ? ` returning ${flyReturn}` : ""
      }`
    )}`;
    window.open(url, "_blank");
  };

  const openThings = () => {
    const city = thingsCity.trim();
    if (!city) return;
    const url = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(city)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="relative">
      {/* Gradient bg */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-white to-white"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-30"
      />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border rounded-full px-3 py-1 text-xs text-gray-700 mb-5">
          <Sparkles className="w-3 h-3 text-primary" />
          Plan, compare and book — all in one place
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Your next trip, <span className="text-primary">powered by AI</span>
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Search flights, stays and experiences — or let our AI build a full itinerary
          tailored to your budget and style in seconds.
        </p>

        {/* Search card */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border overflow-hidden text-left">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 transition ${tab === t.key
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-gray-600 hover:text-primary"
                  }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="p-4 md:p-5">
            {tab === "ai" && (
              <div className="relative">
                <Textarea
                  placeholder="e.g. 5-day romantic trip to Paris in October, mid-budget, love food and museums"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full h-20 bg-gray-50 border focus-visible:ring-0 resize-none pr-14"
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3"
                  onClick={() => gotoAi()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "Weekend in Goa under $500",
                    "Tokyo foodie trip 7 days",
                    "Family trip to Swiss Alps",
                    "Solo backpacking Vietnam",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => gotoAi(s)}
                      className="text-xs bg-gray-50 hover:bg-primary hover:text-white border rounded-full px-3 py-1 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "stays" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field icon={<MapPin className="w-4 h-4" />} label="City / hotel">
                  <input
                    value={stayCity}
                    onChange={(e) => setStayCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <Field icon={<Calendar className="w-4 h-4" />} label="Check-in">
                  <input
                    type="date"
                    value={stayCheckIn}
                    onChange={(e) => setStayCheckIn(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <Field icon={<Calendar className="w-4 h-4" />} label="Check-out">
                  <input
                    type="date"
                    value={stayCheckOut}
                    onChange={(e) => setStayCheckOut(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <div className="flex gap-2">
                  <Field icon={<Users className="w-4 h-4" />} label="Guests" className="flex-1">
                    <input
                      type="number"
                      min={1}
                      value={stayGuests}
                      onChange={(e) => setStayGuests(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                    />
                  </Field>
                  <Button onClick={openStays} className="self-end h-[58px] px-5">
                    <Search className="w-4 h-4 mr-1" /> Search
                  </Button>
                </div>
              </div>
            )}

            {tab === "flights" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field icon={<Plane className="w-4 h-4" />} label="From">
                  <input
                    value={flyFrom}
                    onChange={(e) => setFlyFrom(e.target.value)}
                    placeholder="New York"
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <Field icon={<Plane className="w-4 h-4 rotate-45" />} label="To">
                  <input
                    value={flyTo}
                    onChange={(e) => setFlyTo(e.target.value)}
                    placeholder="Paris"
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <Field icon={<Calendar className="w-4 h-4" />} label="Depart">
                  <input
                    type="date"
                    value={flyDepart}
                    onChange={(e) => setFlyDepart(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <div className="flex gap-2">
                  <Field icon={<Calendar className="w-4 h-4" />} label="Return" className="flex-1">
                    <input
                      type="date"
                      value={flyReturn}
                      onChange={(e) => setFlyReturn(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                    />
                  </Field>
                  <Button onClick={openFlights} className="self-end h-[58px] px-5">
                    <Search className="w-4 h-4 mr-1" /> Search
                  </Button>
                </div>
              </div>
            )}

            {tab === "things" && (
              <div className="flex flex-col md:flex-row gap-3">
                <Field icon={<Compass className="w-4 h-4" />} label="Where to" className="flex-1">
                  <input
                    value={thingsCity}
                    onChange={(e) => setThingsCity(e.target.value)}
                    placeholder="Tokyo"
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </Field>
                <Button onClick={openThings} className="self-end h-[58px] px-5">
                  <Search className="w-4 h-4 mr-1" /> Explore
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Video Section */}
        <div className="flex items-center justify-center flex-col mt-14">
          <h2 className="mb-5 flex gap-2 text-center text-sm text-gray-600">
            Not sure where to start? <strong>See how it works</strong>
            <ArrowDown className="w-4 h-4" />
          </h2>

          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="/vedio.mp4"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex flex-col justify-center border rounded-xl px-3 py-2 hover:border-primary transition ${className}`}
    >
      <span className="text-[11px] text-gray-500 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

export default Hero;