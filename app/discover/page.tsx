"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, TrendingUp } from "lucide-react";

type Destination = {
  _id: string;
  slug: string;
  name: string;
  country: string;
  image: string;
  tag: string;
  description: string;
  rating: number;
  reviews: number;
  trending?: boolean;
};

const TAGS = ["All", "Romantic", "Beach", "Culture", "Scenic", "Urban", "Luxury", "Adventure", "Nature"];

export default function DiscoverPage() {
  const [filter, setFilter] = useState<string>("All");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDestinations = async (tag: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = tag === "All" ? "/api/destinations" : `/api/destinations?tag=${encodeURIComponent(tag)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        setDestinations([]);
      } else {
        setDestinations(data.destinations || []);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations(filter);
  }, [filter]);

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
            className={`px-4 py-1.5 rounded-full text-sm border transition ${filter === t
                ? "bg-primary text-white border-primary"
                : "bg-white hover:border-primary hover:text-primary"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading destinations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((d) => (
            <div
              key={d._id}
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
      )}

      {!loading && error && (
        <div className="text-center mt-10 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 max-w-2xl mx-auto">
          <p className="font-semibold">Couldn't load destinations</p>
          <p className="text-xs mt-2">{error}</p>
          <p className="text-xs mt-3 text-red-600/80">
            If this mentions IP allowlist, add your current IP to MongoDB Atlas
            → Network Access, then refresh.
          </p>
        </div>
      )}

      {!loading && !error && destinations.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>No destinations found yet.</p>
          <p className="text-xs mt-2">
            Run <code className="bg-gray-100 px-1 rounded">POST /api/seed</code> to populate the database.
          </p>
        </div>
      )}
    </div>
  );
}