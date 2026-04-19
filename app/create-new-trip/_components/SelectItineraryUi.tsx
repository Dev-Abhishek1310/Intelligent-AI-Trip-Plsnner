"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Calendar, Users, Wallet, Sparkles, Loader2 } from "lucide-react";
import { TripInfo } from "./ChatBox";

type Props = {
  options: TripInfo[];
  onSelect: (index: number) => void;
  disabled?: boolean;
};

function SelectItineraryUi({ options, onSelect, disabled }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!options || options.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {options.map((opt, idx) => {
        const isSelected = selectedIdx === idx;
        const highlights = Array.isArray(opt.itinerary)
          ? opt.itinerary
              .slice(0, 2)
              .flatMap((d) => (d?.activities ?? []).slice(0, 2).map((a) => a?.place_name))
              .filter(Boolean)
          : [];

        return (
          <div
            key={idx}
            onClick={() => !disabled && setSelectedIdx(idx)}
            className={`rounded-xl border p-4 cursor-pointer transition ${
              isSelected
                ? "border-primary ring-2 ring-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary">
                  {opt.theme || `Option ${idx + 1}`}
                </h3>
              </div>
              {isSelected && <Check className="w-5 h-5 text-primary" />}
            </div>

            {opt.summary && (
              <p className="text-sm text-gray-600 mt-1">{opt.summary}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {opt.origin} → {opt.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {opt.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {opt.group_size}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-3 h-3" /> {opt.budget}
              </span>
            </div>

            {highlights.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                Highlights: {highlights.join(" · ")}
              </p>
            )}
          </div>
        );
      })}

      <Button
        disabled={disabled || selectedIdx === null}
        onClick={() => selectedIdx !== null && onSelect(selectedIdx)}
        className="mt-2"
      >
        {disabled ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
          </>
        ) : selectedIdx === null ? (
          "Select an itinerary above"
        ) : (
            
          "Use this itinerary"
        )}
      </Button>
    </div>
  );
}

export default SelectItineraryUi;