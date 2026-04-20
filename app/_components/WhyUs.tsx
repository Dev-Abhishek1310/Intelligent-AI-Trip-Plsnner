"use client";

import React from "react";
import {
    Sparkles,
    MapPin,
    Clock,
    ShieldCheck,
    Wallet,
    HeadphonesIcon,
} from "lucide-react";

const FEATURES = [
    {
        icon: <Sparkles className="w-6 h-6 text-primary" />,
        title: "AI-Powered Planning",
        description:
            "Our AI understands your travel style and builds a full personalized itinerary in seconds — no more hours of research.",
    },
    {
        icon: <MapPin className="w-6 h-6 text-primary" />,
        title: "190+ Destinations",
        description:
            "From hidden gems to iconic landmarks, explore curated experiences across more than 190 countries worldwide.",
    },
    {
        icon: <Clock className="w-6 h-6 text-primary" />,
        title: "Plan in Minutes",
        description:
            "Tell us your destination, dates and budget — get a complete day-by-day itinerary ready to book in under a minute.",
    },
    {
        icon: <Wallet className="w-6 h-6 text-primary" />,
        title: "Budget-Aware Trips",
        description:
            "We factor in your spending limits to suggest the best hotels, flights and activities that fit your budget perfectly.",
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-primary" />,
        title: "Trusted & Secure",
        description:
            "Your data is always safe. We partner only with verified providers so you can book with total confidence.",
    },
    {
        icon: <HeadphonesIcon className="w-6 h-6 text-primary" />,
        title: "24/7 Support",
        description:
            "Our team is available around the clock to help with any questions or changes to your travel plans.",
    },
];

export default function WhyUs() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">
                    Why choose us
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                    Everything you need to travel smarter
                </h2>
                <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
                    RoamGenie combines cutting-edge AI with real travel expertise to make
                    every trip effortless, affordable and memorable.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((f) => (
                    <div
                        key={f.title}
                        className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                            {f.icon}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {f.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}