"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const SelectPreferencesList = [
  {
    id: 1,
    title: "Kid-Friendly",
    desc: "Activities suitable for children",
    icon: "👨‍👩‍👧",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 2,
    title: "Pet-Friendly",
    desc: "Traveling with pets",
    icon: "🐾",
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 3,
    title: "Accessibility",
    desc: "Wheelchair / mobility friendly",
    icon: "♿",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 4,
    title: "Vegetarian / Vegan",
    desc: "Plant-based dining options",
    icon: "🥗",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 5,
    title: "Halal",
    desc: "Halal food availability",
    icon: "🕌",
    color: "bg-teal-100 text-teal-600",
  },
  {
    id: 6,
    title: "Eco-Friendly",
    desc: "Sustainable travel choices",
    icon: "🌱",
    color: "bg-lime-100 text-lime-600",
  },
  {
    id: 7,
    title: "Off the Beaten Path",
    desc: "Less touristy, local gems",
    icon: "🗺️",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 8,
    title: "Photo Spots",
    desc: "Instagrammable locations",
    icon: "📷",
    color: "bg-purple-100 text-purple-600",
  },
];

function PreferencesUi({
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
    onSelectedOption(
      selected.length === 0 ? "No specific preferences" : selected.join(", ")
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {SelectPreferencesList.map((item) => {
          const isActive = selected.includes(item.title);
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center text-center p-4 border rounded-xl shadow-sm transition cursor-pointer bg-white ${
                isActive
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSelectedOption("No specific preferences")}>
          Skip
        </Button>
        <Button onClick={confirm} disabled={selected.length === 0}>
          Continue{selected.length > 0 ? ` (${selected.length})` : ""}
        </Button>
      </div>
    </div>
  );
}

export default PreferencesUi;