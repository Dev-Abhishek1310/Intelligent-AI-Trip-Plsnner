import React from "react";
import Link from "next/link";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";

const socialLinks: { label: string; href: null; icon: React.ReactNode }[] = [
    { label: "Email", href: null, icon: <Mail size={18} /> },
    { label: "LinkedIn", href: null, icon: <Linkedin size={18} /> },
    { label: "Twitter", href: null, icon: <Twitter size={18} /> },
    { label: "GitHub", href: null, icon: <Github size={18} /> },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-2">
                    <h3 className="text-white text-xl font-semibold mb-3">RoamGenie</h3>
                    <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                        AI-powered trip planning that turns rough ideas into detailed
                        day-by-day itineraries in seconds.
                    </p>
                </div>

                <div>
                    <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                        Explore
                    </h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link href="/discover" className="hover:text-primary transition-colors">Discover</Link></li>
                        <li><Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                        Company
                    </h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact us</Link></li>
                        <li><Link href="/my-trips" className="hover:text-primary transition-colors">My trips</Link></li>
                        <li><Link href="/create-new-trip" className="hover:text-primary transition-colors">Plan a trip</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} RoamGenie. All rights reserved.
                    </p>
                    <div className="flex gap-3">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href ?? undefined}
                                aria-label={s.label}
                                aria-disabled={s.href === null}
                                className="p-2 rounded-full bg-gray-800/60 text-gray-400 hover:text-primary hover:bg-gray-800 transition-colors cursor-not-allowed"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}