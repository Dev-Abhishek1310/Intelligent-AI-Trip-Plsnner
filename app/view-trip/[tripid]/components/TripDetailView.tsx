"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Wallet,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Ticket,
  Sun,
} from "lucide-react";
import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import BudgetBreakdown from "@/app/create-new-trip/_components/BudgetBreakdown";
import TripEssentials from "@/app/create-new-trip/_components/TripEssentials";
import HotelCardItem from "@/app/create-new-trip/_components/HotelCardItem";
import PlaceCardItem from "@/app/create-new-trip/_components/PlaceCardItem";
import FlightsSection from "./FlightsSection";
import BookingSummary from "./BookingSummary";

function buildNarrative(trip: TripInfo): string {
  const days = parseInt(trip.duration || "0", 10) || 0;
  const hotels = Array.isArray(trip.hotels) ? trip.hotels.length : 0;
  const activitiesCount = Array.isArray(trip.itinerary)
    ? trip.itinerary.reduce(
      (sum, d) => sum + (Array.isArray(d.activities) ? d.activities.length : 0),
      0
    )
    : 0;

  const highlights = Array.isArray(trip.itinerary)
    ? trip.itinerary
      .flatMap((d) =>
        (Array.isArray(d.activities) ? d.activities : [])
          .slice(0, 1)
          .map((a) => a.place_name)
      )
      .filter(Boolean)
      .slice(0, 3)
    : [];

  const highlightText =
    highlights.length > 0
      ? ` You'll experience ${highlights
        .map((h, i) =>
          i === highlights.length - 1 && highlights.length > 1
            ? `and ${h}`
            : h
        )
        .join(highlights.length > 2 ? ", " : " ")}.`
      : "";

  return `This ${days}-day journey takes you from ${trip.origin || "your origin"
    } to ${trip.destination || "your destination"
    }, planned for a ${(trip.group_size || "").toLowerCase() || "traveler"} with a ${(
      trip.budget || ""
    ).toLowerCase() || "flexible"} budget. We've shortlisted ${hotels} place${hotels === 1 ? "" : "s"
    } to stay and curated ${activitiesCount} experience${activitiesCount === 1 ? "" : "s"
    } across your itinerary.${highlightText}`;
}

export default function TripDetailView({ trip }: { trip: TripInfo }) {
  const narrative = buildNarrative(trip);
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5 border p-6 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              Your Trip Plan
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
              <span className="text-gray-800">{trip.origin || "—"}</span>{" "}
              <ArrowRight className="inline-block w-7 h-7 text-primary mx-2 align-middle" />{" "}
              <span className="text-primary">{trip.destination || "—"}</span>
            </h1>
            <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-700">
              <span className="flex items-center gap-2 bg-white border rounded-full px-3 py-1">
                <Calendar className="w-4 h-4 text-primary" /> {trip.duration}
              </span>
              <span className="flex items-center gap-2 bg-white border rounded-full px-3 py-1">
                <Users className="w-4 h-4 text-primary" /> {trip.group_size}
              </span>
              <span className="flex items-center gap-2 bg-white border rounded-full px-3 py-1">
                <Wallet className="w-4 h-4 text-primary" /> {trip.budget}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About this trip */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">About this trip</h2>
        <p className="text-gray-700 leading-relaxed text-[15px]">{narrative}</p>
      </section>

      {/* Booking summary — flights + hotels + activities in one place */}
      <BookingSummary trip={trip} />

      {/* Flights */}
      <FlightsSection trip={trip} />

      {/* Budget + Essentials side-by-side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <BudgetBreakdown trip={trip} />
        <TripEssentials trip={trip} />
      </section>

      {/* Hotels */}
      {Array.isArray(trip.hotels) && trip.hotels.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-semibold">Where you'll stay</h2>
            <span className="text-sm text-gray-500">
              {trip.hotels.length} recommended stay
              {trip.hotels.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-5">
            Curated hotels matched to your budget and trip style. Click "View
            Detail" on any card to open it in Google Maps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trip.hotels.map((h) => (
              <HotelCardItem key={h.hotel_name} hotel={h} />
            ))}
          </div>
        </section>
      )}

      {/* Day-by-day as a narrative */}
      {itinerary.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your day-by-day journey</h2>
            <span className="text-sm text-gray-500">
              {itinerary.length} day{itinerary.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {itinerary.map((day) => (
              <article
                key={day.day}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Day {day.day}</h3>
                      {day.day_plan && (
                        <p className="text-sm text-gray-600">{day.day_plan}</p>
                      )}
                    </div>
                  </div>
                  {day.best_time_to_visit && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border rounded-full px-3 py-1">
                      <Sun className="w-3 h-3" /> Best time:{" "}
                      {day.best_time_to_visit}
                    </span>
                  )}
                </div>

                {Array.isArray(day.activities) && day.activities.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {day.activities.map((a) => (
                      <PlaceCardItem key={a.place_name} activity={a} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All places list */}
      {itinerary.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            All places you'll visit
          </h2>
          <div className="bg-white border rounded-2xl divide-y">
            {itinerary.flatMap((day) =>
              (Array.isArray(day.activities) ? day.activities : []).map((a) => (
                <div
                  key={`${day.day}-${a.place_name}`}
                  className="p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-semibold">
                    D{day.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <h4 className="font-semibold">{a.place_name}</h4>
                      {a.ticket_pricing && (
                        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border rounded-full px-2 py-0.5">
                          <Ticket className="w-3 h-3" /> {a.ticket_pricing}
                        </span>
                      )}
                    </div>
                    {a.place_address && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {a.place_address}
                      </p>
                    )}
                    {a.place_details && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {a.place_details}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      {a.best_time_to_visit && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.best_time_to_visit}
                        </span>
                      )}
                      {a.time_travel_each_location && (
                        <span>{a.time_travel_each_location}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <div className="flex justify-center pt-4">
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            trip.destination || ""
          )}`}
          target="_blank"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <MapPin className="w-4 h-4" /> Open {trip.destination} in Google Maps
        </Link>
      </div>
    </div>
  );
}