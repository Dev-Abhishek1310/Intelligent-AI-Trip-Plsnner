"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const SelectInterestsList = [
  {
    id: 1,
    title: "Adventure",
    desc: "Hiking, water sports, adrenaline",
    icon: "🏔️",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 2,
    title: "Sightseeing",
    desc: "Iconic landmarks & scenic spots",
    icon: "📸",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    title: "Cultural",
    desc: "Museums, heritage, local life",
    icon: "🏛️",
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 4,
    title: "Food",
    desc: "Street eats & fine dining",
    icon: "🍜",
    color: "bg-red-100 text-red-600",
  },
  {
    id: 5,
    title: "Nightlife",
    desc: "Bars, clubs, late-night vibes",
    icon: "🌃",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 6,
    title: "Relaxation",
    desc: "Beaches, spas, slow travel",
    icon: "🌴",
    color: "bg-green-100 text-green-600",
  },
];

function InterestsUi({
  onSelectedOption,
}: {
  onSelectedOption: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const confirm = () => {
    if (selected.length === 0) return;
    onSelectedOption(selected.join(", "));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {SelectInterestsList.map((item) => {
          const isActive = selected.includes(item.title);
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center text-center p-4 border rounded-xl shadow-sm transition cursor-pointer bg-white ${isActive
                  ? "border-primary ring-2 ring-primary"
                  : "hover:shadow-md hover:border-primary"
                }`}
              onClick={() => toggle(item.title)}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-2xl ${item.color}`}
              >
                {item.icon}
              </div>
              <h2 className="text-sm font-semibold mt-3">{item.title}</h2>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>
      <Button
        className="self-end"
        disabled={selected.length === 0}
        onClick={confirm}
      >
        Continue{selected.length > 0 ? ` (${selected.length})` : ""}
      </Button>
    </div>
  );
}

export default InterestsUi;