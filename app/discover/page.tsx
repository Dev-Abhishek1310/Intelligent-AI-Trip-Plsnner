"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, TrendingUp } from "lucide-react";

type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  tag: string;
  description: string;
  rating: number;
  reviews: number;
  trending?: boolean;
};

const POPULAR: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    tag: "Romantic",
    description: "The Eiffel Tower, charming cafés, and world-class museums.",
    rating: 4.8,
    reviews: 12480,
    trending: true,
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    tag: "Beach",
    description: "Tropical beaches, ancient temples, and vibrant culture.",
    rating: 4.7,
    reviews: 9840,
    trending: true,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    tag: "Culture",
    description: "Neon-lit streets, timeless temples, and unforgettable food.",
    rating: 4.9,
    reviews: 15320,
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    tag: "Scenic",
    description: "Whitewashed villages perched over turquoise Aegean waters.",
    rating: 4.8,
    reviews: 7210,
  },
  {
    id: "newyork",
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    tag: "Urban",
    description: "The city that never sleeps — Broadway, skyline, and energy.",
    rating: 4.6,
    reviews: 18950,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    tag: "Luxury",
    description: "Futuristic skyline, desert adventures, and unmatched luxury.",
    rating: 4.7,
    reviews: 11230,
    trending: true,
  },
  {
    id: "swiss",
    name: "Swiss Alps",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800",
    tag: "Adventure",
    description: "Snow-capped peaks, alpine villages, and scenic train rides.",
    rating: 4.9,
    reviews: 6430,
  },
  {
    id: "iceland",
    name: "Iceland",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
    tag: "Nature",
    description: "Waterfalls, glaciers, and the Northern Lights.",
    rating: 4.8,
    reviews: 5140,
  },
];

const TAGS = ["All", "Romantic", "Beach", "Culture", "Scenic", "Urban", "Luxury", "Adventure", "Nature"];

export default function DiscoverPage() {
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All" ? POPULAR : POPULAR.filter((d) => d.tag === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          Discover your next <span className="text-primary">adventure</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Handpicked destinations loved by travelers worldwide.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              filter === t
                ? "bg-primary text-white border-primary"
                : "bg-white hover:border-primary hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden transition border"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
              {d.trending && (
                <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
              <span className="absolute top-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-full font-medium">
                {d.tag}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{d.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{d.rating}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {d.country}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {d.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">
                  {d.reviews.toLocaleString()} reviews
                </span>
                <Link href={`/create-new-trip?destination=${encodeURIComponent(d.name)}`}>
                  <Button size="sm">Plan Trip</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No destinations match this filter yet.
        </p>
      )}
    </div>
  );
}