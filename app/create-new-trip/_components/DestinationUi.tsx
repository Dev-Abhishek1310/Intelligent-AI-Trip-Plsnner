"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const DestinationSuggestions = [
  { label: "Romantic Paris", icon: "🗼" },
  { label: "Scenic Switzerland", icon: "🏔️" },
  { label: "Zen Japan", icon: "🗾" },
  { label: "Beach Bali", icon: "🏖️" },
  { label: "Classic London", icon: "🇬🇧" },
  { label: "Coastal Italy", icon: "🇮🇹" },
  { label: "Vibrant Thailand", icon: "🛕" },
  { label: "Desert Dubai", icon: "🏜️" },
];

function DestinationUi({
  onSelectedOption,
}: {
  onSelectedOption: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onSelectedOption(v);
  };

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex gap-2">
        <input
          placeholder="Where do you want to go?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="flex-1 px-3 py-2 border rounded-md bg-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <Button onClick={submit} disabled={!value.trim()}>
          Send
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DestinationSuggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onSelectedOption(s.label)}
            className="px-3 py-2 text-sm border rounded-lg bg-white hover:border-primary hover:text-primary transition text-center"
          >
            {s.label} {s.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DestinationUi;