// app/contact-us/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/app/_components/Footer";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.location.href = `mailto:hello@roamgenie.app?subject=${encodeURIComponent(
      subject || `Contact from ${name}`
    )}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 px-6">
        <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/10),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <MessageSquare size={14} /> We reply within 24 hours
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Let&apos;s plan something together
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Questions, feedback, or partnership ideas — drop us a line and the
            RoamGenie team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="flex-1 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <aside className="lg:col-span-2 flex flex-col gap-4">
            <InfoCard
              icon={<Mail className="text-primary" size={20} />}
              title="Email us"
              value="hello@roamgenie.app"
              hint="Best for detailed questions"
            />
            <InfoCard
              icon={<Phone className="text-primary" size={20} />}
              title="Call us"
              value="+1 (555) 014-2025"
              hint="Mon–Fri, 9am–6pm"
            />
            <InfoCard
              icon={<MapPin className="text-primary" size={20} />}
              title="Visit"
              value="Remote-first · HQ in Bengaluru, IN"
              hint="By appointment"
            />
            <InfoCard
              icon={<Clock className="text-primary" size={20} />}
              title="Response time"
              value="Under 24 hours"
              hint="Usually much faster"
            />
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-8 md:p-10">
              {sent ? (
                <div className="flex flex-col items-center text-center py-10">
                  <CheckCircle2 className="text-green-500 mb-4" size={48} />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Message on its way
                  </h2>
                  <p className="text-gray-600 max-w-md">
                    Your mail client should have opened. If not, write to us at
                    hello@roamgenie.app and we&apos;ll take it from there.
                  </p>
                </div>
              ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Your name">
                      <input
                        type="text"
                        placeholder="Ada Lovelace"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Field>
                    <Field label="Email address">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <input
                      type="text"
                      placeholder="What is this about?"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </Field>

                  <Field label="Message">
                    <textarea
                      placeholder="Tell us a little about what you need…"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg h-40 resize-none focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </Field>

                  <p className="text-xs text-gray-500">
                    By submitting, you agree to be contacted about your request.
                    We never share your details.
                  </p>

                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary/90 py-6 rounded-lg text-base font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={18} /> Send message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-white ring-1 ring-gray-200/70 shadow-sm rounded-xl p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
      <div className="p-2 rounded-lg bg-primary/10 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      </div>
    </div>
  );
}