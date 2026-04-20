"use client";

import React from "react";
import Link from "next/link";
import { Plane, Clock, ExternalLink, ArrowRight } from "lucide-react";
import { Flight, TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import { Button } from "@/components/ui/button";

const SAMPLE_AIRLINES = [
    { name: "Delta", prefix: "DL" },
    { name: "Emirates", prefix: "EK" },
    { name: "Lufthansa", prefix: "LH" },
    { name: "Air France", prefix: "AF" },
    { name: "United", prefix: "UA" },
];

function generateSampleFlights(origin: string, destination: string): Flight[] {
    const rand = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;
    return SAMPLE_AIRLINES.slice(0, 3).map((a, i) => {
        const hours = rand(5, 14);
        const depH = rand(6, 22);
        const arrH = (depH + hours) % 24;
        return {
            airline: a.name,
            flight_number: `${a.prefix}${rand(100, 999)}`,
            from_airport: origin,
            to_airport: destination,
            departure_time: `${String(depH).padStart(2, "0")}:${rand(0, 5)}0`,
            arrival_time: `${String(arrH).padStart(2, "0")}:${rand(0, 5)}0`,
            duration: `${hours}h ${rand(0, 59)}m`,
            stops: i === 0 ? 0 : i === 1 ? 1 : 1,
            price: `$${rand(380, 1200)}`,
            cabin: i === 0 ? "Economy" : i === 1 ? "Premium Economy" : "Business",
        };
    });
}

export default function FlightsSection({ trip }: { trip: TripInfo }) {
    const origin = trip.origin || "";
    const destination = trip.destination || "";
    const flights: Flight[] =
        Array.isArray(trip.flights) && trip.flights.length > 0
            ? trip.flights
            : generateSampleFlights(origin, destination);

    const googleFlightsUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(
        `Flights from ${origin} to ${destination}`
    )}`;
    const skyscannerUrl = `https://www.skyscanner.com/transport/flights/${encodeURIComponent(
        origin
    )}/${encodeURIComponent(destination)}/`;
    const kayakUrl = `https://www.kayak.com/flights/${encodeURIComponent(
        origin
    )}-${encodeURIComponent(destination)}`;

    return (
        <section className="mb-10">
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
                <div>
                    <h2 className="text-2xl font-semibold">Flights</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {origin} <ArrowRight className="inline w-3 h-3" /> {destination} — sample
                        fares to compare.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={googleFlightsUrl} target="_blank">
                        <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" /> Google Flights
                        </Button>
                    </Link>
                    <Link href={skyscannerUrl} target="_blank">
                        <Button size="sm" variant="outline">
                            Skyscanner
                        </Button>
                    </Link>
                    <Link href={kayakUrl} target="_blank">
                        <Button size="sm" variant="outline">
                            Kayak
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {flights.map((f, i) => (
                    <div
                        key={`${f.airline}-${i}`}
                        className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <Plane className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{f.airline}</div>
                                    <div className="text-xs text-gray-500">
                                        {f.flight_number} · {f.cabin || "Economy"}
                                    </div>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-primary">{f.price}</div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <div className="font-semibold">{f.departure_time}</div>
                                <div className="text-xs text-gray-500">{f.from_airport}</div>
                            </div>
                            <div className="flex-1 mx-3 flex flex-col items-center">
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {f.duration}
                                </div>
                                <div className="w-full border-t border-dashed my-1" />
                                <div className="text-[11px] text-gray-500">
                                    {f.stops === 0 ? "Non-stop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{f.arrival_time}</div>
                                <div className="text-xs text-gray-500">{f.to_airport}</div>
                            </div>
                        </div>

                        <Link
                            href={
                                f.booking_url ||
                                `https://www.google.com/travel/flights?q=${encodeURIComponent(
                                    `${f.airline} ${f.from_airport} to ${f.to_airport}`
                                )}`
                            }
                            target="_blank"
                            className="mt-4 block"
                        >
                            <Button size="sm" className="w-full">
                                Book this flight <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}