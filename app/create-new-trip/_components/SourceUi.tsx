"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SourceSuggestions = [
  { city: "New Delhi", flag: "🇮🇳" },
  { city: "Mumbai", flag: "🇮🇳" },
  { city: "Bengaluru", flag: "🇮🇳" },
  { city: "London", flag: "🇬🇧" },
  { city: "New York", flag: "🇺🇸" },
  { city: "Dubai", flag: "🇦🇪" },
  { city: "Singapore", flag: "🇸🇬" },
  { city: "Sydney", flag: "🇦🇺" },
];

function SourceUi({
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
          placeholder="Type your departure city..."
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
      <div className="flex flex-wrap gap-2">
        {SourceSuggestions.map((s) => (
          <button
            key={s.city}
            type="button"
            onClick={() => onSelectedOption(s.city)}
            className="px-3 py-1.5 text-sm border rounded-full bg-white hover:border-primary hover:text-primary transition"
          >
            {s.city} {s.flag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SourceUi;