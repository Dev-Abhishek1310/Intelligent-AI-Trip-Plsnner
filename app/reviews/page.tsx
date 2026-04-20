"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, ThumbsUp, User } from "lucide-react";

type Review = {
  _id: string;
  author: string;
  avatarInitial: string;
  destination: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  helpful: number;
  tripType?: string;
};

function StarRow({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          onClick={() => onChange?.(i)}
          className={`w-4 h-4 ${onChange ? "cursor-pointer" : ""} ${i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [form, setForm] = useState({
    author: "",
    destination: "",
    rating: 5,
    title: "",
    body: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (r.rating < minRating) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          r.destination.toLowerCase().includes(s) ||
          r.title.toLowerCase().includes(s) ||
          r.body.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [reviews, minRating, search]);

  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const submit = async () => {
    if (!form.author.trim() || !form.destination.trim() || !form.title.trim() || !form.body.trim())
      return;
    setPosting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const { review } = await res.json();
        setReviews((prev) => [review, ...prev]);
        setForm({ author: "", destination: "", rating: 5, title: "", body: "" });
        setShowForm(false);
      }
    } finally {
      setPosting(false);
    }
  };

  const markHelpful = async (id: string) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "helpful" }),
    });
    if (res.ok) {
      const { review } = await res.json();
      setReviews((prev) => prev.map((r) => (r._id === id ? review : r)));
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Traveler <span className="text-primary">Reviews</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Real experiences from travelers who've been there.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-bold text-primary">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 justify-center">
              <StarRow value={Math.round(avgRating)} />
            </div>
            <div className="text-xs text-gray-500">{reviews.length} reviews</div>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-4">Share your experience</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Your name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Destination (e.g. Paris, France)"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-600">Rating:</span>
            <StarRow
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
            />
          </div>
          <input
            placeholder="Review title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-4 w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-primary"
          />
          <Textarea
            placeholder="Tell us about your trip..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="mt-4 h-28"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={submit} disabled={posting}>
              {posting ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder="Search by destination or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md text-sm outline-none focus:border-primary"
        />
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="px-3 py-2 border rounded-md text-sm outline-none focus:border-primary bg-white"
        >
          <option value={0}>All ratings</option>
          <option value={5}>5 stars only</option>
          <option value={4}>4+ stars</option>
          <option value={3}>3+ stars</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading reviews...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
                  {r.avatarInitial || <User className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-semibold">{r.author}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {r.destination}
                        {r.tripType && <span className="ml-2">• {r.tripType}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRow value={r.rating} />
                      <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mt-3">{r.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{r.body}</p>
                  <button
                    onClick={() => markHelpful(r._id)}
                    className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-primary"
                  >
                    <ThumbsUp className="w-3 h-3" /> Helpful ({r.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No reviews match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}