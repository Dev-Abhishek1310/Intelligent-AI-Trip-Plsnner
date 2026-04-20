"use client";

import React from "react";
import Link from "next/link";
import {
    Plane,
    Bed,
    Ticket,
    Wallet,
    ShieldCheck,
    ExternalLink,
} from "lucide-react";
import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import { Button } from "@/components/ui/button";

function estimateFromBudget(budget: string, days: number, guests: number) {
    const b = (budget || "").toLowerCase();
    const base = b.includes("high") || b.includes("luxury")
        ? { hotel: 280, flight: 900, activities: 90 }
        : b.includes("low") || b.includes("cheap") || b.includes("budget")
            ? { hotel: 70, flight: 420, activities: 30 }
            : { hotel: 140, flight: 620, activities: 55 };

    const hotel = base.hotel * Math.max(days, 1);
    const flight = base.flight * Math.max(guests, 1);
    const activities = base.activities * Math.max(days, 1) * Math.max(guests, 1);
    return {
        hotel,
        flight,
        activities,
        total: hotel + flight + activities,
    };
}

function parseGuests(groupSize: string): number {
    const s = (groupSize || "").toLowerCase();
    if (s.includes("solo")) return 1;
    if (s.includes("couple")) return 2;
    if (s.includes("family")) return 4;
    if (s.includes("friends")) return 3;
    const n = parseInt(s, 10);
    return Number.isFinite(n) && n > 0 ? n : 2;
}

export default function BookingSummary({ trip }: { trip: TripInfo }) {
    const days = parseInt(trip.duration || "0", 10) || 3;
    const guests = parseGuests(trip.group_size || "");
    const est = estimateFromBudget(trip.budget || "", days, guests);

    const booking = trip.booking;
    const total =
        booking?.estimated_total ||
        `$${est.total.toLocaleString()}`;
    const flightCost =
        booking?.estimated_flight_cost ||
        `$${est.flight.toLocaleString()}`;
    const hotelCost =
        booking?.estimated_hotel_cost ||
        `$${est.hotel.toLocaleString()}`;

    const bookingCom = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        trip.destination || ""
    )}&group_adults=${guests}&no_rooms=1&group_children=0`;
    const agoda = `https://www.agoda.com/search?city=&searchrequest=${encodeURIComponent(
        trip.destination || ""
    )}&adults=${guests}`;
    const viator = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(
        trip.destination || ""
    )}`;

    return (
        <section className="mb-10">
            <div className="rounded-3xl border bg-gradient-to-br from-primary/5 via-white to-white p-6 md:p-8">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" /> Book this trip
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Estimated cost for {guests} traveler{guests > 1 ? "s" : ""} · {days} day
                            {days > 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                            Estimated total
                        </div>
                        <div className="text-3xl font-bold text-primary">{total}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 justify-end">
                            <ShieldCheck className="w-3 h-3" /> Free cancellation on most bookings
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card
                        icon={<Plane className="w-4 h-4" />}
                        label="Flights"
                        value={flightCost}
                        cta="Compare flights"
                        href={`https://www.google.com/travel/flights?q=${encodeURIComponent(
                            `Flights from ${trip.origin} to ${trip.destination}`
                        )}`}
                    />
                    <Card
                        icon={<Bed className="w-4 h-4" />}
                        label="Hotels"
                        value={hotelCost}
                        cta="Find hotels"
                        href={bookingCom}
                    />
                    <Card
                        icon={<Ticket className="w-4 h-4" />}
                        label="Activities"
                        value={`$${est.activities.toLocaleString()}`}
                        cta="Browse experiences"
                        href={viator}
                    />
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                    <Link href={bookingCom} target="_blank">
                        <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" /> Booking.com
                        </Button>
                    </Link>
                    <Link href={agoda} target="_blank">
                        <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" /> Agoda
                        </Button>
                    </Link>
                    <Link href={viator} target="_blank">
                        <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" /> Viator
                        </Button>
                    </Link>
                    <Link
                        href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(
                            trip.destination || ""
                        )}`}
                        target="_blank"
                    >
                        <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" /> Tripadvisor
                        </Button>
                    </Link>
                </div>

                {booking?.notes && (
                    <p className="text-xs text-gray-600 mt-4 italic">{booking.notes}</p>
                )}
            </div>
        </section>
    );
}

function Card({
    icon,
    label,
    value,
    cta,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    cta: string;
    href: string;
}) {
    return (
        <div className="bg-white border rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {icon}
                </span>
                {label}
            </div>
            <div className="text-xl font-bold mt-2">{value}</div>
            <Link
                href={href}
                target="_blank"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
            >
                {cta} <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
    );
}