"use client";
import { Globe2, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

type FinalUiProps = {
  viewTrip: () => void;
  ready?: boolean;
};

function FinalUi({ viewTrip, ready }: FinalUiProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-2xl shadow-md">
      {ready ? (
        <CheckCircle2 className="text-primary w-10 h-10" />
      ) : (
        <Globe2 className="text-primary w-10 h-10 animate-bounce" />
      )}

      <h2 className="mt-3 text-lg font-semibold text-primary">
        {ready ? "🎉 Your trip is ready!" : "✈️ Planning your dream trip..."}
      </h2>

      <p className="text-gray-500 text-sm text-center mt-1">
        {ready
          ? "Click View Trip to explore your itinerary."
          : "Gathering best destinations, activities, and travel details for you."}
      </p>

      <Button
        disabled={!ready}
        onClick={viewTrip}
        className={`mt-4 px-6 py-2 transition ${ready
            ? "opacity-100"
            : "opacity-50 cursor-not-allowed"
          }`}
      >
        {ready ? (
          "View Trip"
        ) : (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing...
          </>
        )}
      </Button>
    </div>
  );
}

export default FinalUi;