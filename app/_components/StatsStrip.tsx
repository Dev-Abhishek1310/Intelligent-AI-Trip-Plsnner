"use client";

import React from "react";
import { Globe2, Users, Star, Plane } from "lucide-react";

const STATS = [
    { icon: <Globe2 className="w-6 h-6" />, value: "190+", label: "Countries covered" },
    { icon: <Users className="w-6 h-6" />, value: "120K", label: "Happy travelers" },
    { icon: <Star className="w-6 h-6" />, value: "4.9", label: "Average rating" },
    { icon: <Plane className="w-6 h-6" />, value: "500+", label: "Airlines & hotels" },
];

export default function StatsStrip() {
    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border rounded-2xl shadow-sm p-6 -mt-6 relative z-10">
                {STATS.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {s.icon}
                        </div>
                        <div>
                            <div className="text-xl font-bold leading-none">{s.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}