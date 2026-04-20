"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, TrendingUp, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

type Destination = {
    _id: string;
    slug: string;
    name: string;
    country: string;
    image: string;
    tag: string;
    rating: number;
    reviews: number;
    trending?: boolean;
};

const DEAL_BADGES = ["Up to 40% off", "Free cancellation", "Member price", "Hot deal", "Best value"];

export default function TrendingDeals() {
    const [items, setItems] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/destinations")
            .then((r) => r.json())
            .then((d) => setItems((d.destinations || []).slice(0, 4)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <div className="text-xs uppercase tracking-wide text-primary font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending now
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1">
                        Popular deals this week
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">
                        Handpicked stays and experiences at limited-time prices.
                    </p>
                </div>
                <Link
                    href="/discover"
                    className="text-sm text-primary hover:underline hidden md:block"
                >
                    View all destinations →
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-8">Loading deals...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {items.map((d, i) => (
                        <div
                            key={d._id}
                            className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={d.image}
                                    alt={d.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                                    <Tag className="w-3 h-3" /> {DEAL_BADGES[i % DEAL_BADGES.length]}
                                </span>
                                <span className="absolute bottom-3 left-3 bg-white/95 text-xs px-2 py-1 rounded-full font-medium">
                                    {d.tag}
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{d.name}</h3>
                                    <span className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        {d.rating}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{d.country}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500">
                                        {d.reviews.toLocaleString()} reviews
                                    </span>
                                    <Link
                                        href={`/create-new-trip?prompt=${encodeURIComponent(
                                            `Plan a trip to ${d.name}, ${d.country}`
                                        )}`}
                                    >
                                        <Button size="sm" variant="outline">
                                            Plan trip
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}