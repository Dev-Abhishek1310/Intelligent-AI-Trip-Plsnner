"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CtaBanner() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-orange-500 text-white p-10 md:p-14">
                <div
                    aria-hidden
                    className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10"
                />
                <div
                    aria-hidden
                    className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10"
                />
                <div className="relative max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs">
                        <Sparkles className="w-3 h-3" />
                        AI-powered · Free to try
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
                        Your next adventure is one prompt away.
                    </h2>
                    <p className="text-white/90 mt-2">
                        Just tell us your dream destination, dates and vibe — we'll handle the rest.
                    </p>
                    <Link href="/create-new-trip">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="mt-6 bg-white text-primary hover:bg-white/90 font-semibold"
                        >
                            Start planning with AI <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}