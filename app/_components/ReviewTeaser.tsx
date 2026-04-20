"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Quote } from "lucide-react";

type Review = {
    _id: string;
    author: string;
    avatarInitial: string;
    destination: string;
    rating: number;
    title: string;
    body: string;
};

export default function ReviewsTeaser() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch("/api/reviews")
            .then((r) => r.json())
            .then((d) => setReviews((d.reviews || []).slice(0, 3)));
    }, []);

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <div className="text-xs uppercase tracking-wide text-primary font-semibold">
                        Real stories
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1">
                        Loved by travelers worldwide
                    </h2>
                </div>
                <Link href="/reviews" className="text-sm text-primary hover:underline hidden md:block">
                    Read all reviews →
                </Link>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Loading stories...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {reviews.map((r) => (
                        <div
                            key={r._id}
                            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition relative"
                        >
                            <Quote className="absolute top-4 right-4 w-6 h-6 text-primary/20" />
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <h3 className="font-semibold mt-3">{r.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{r.body}</p>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                                    {r.avatarInitial}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{r.author}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {r.destination}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}