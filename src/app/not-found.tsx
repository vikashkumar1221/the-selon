"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#0B0B0D]">
      <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold mb-4">
        <Scissors className="w-6 h-6" />
      </div>
      <h2 className="text-3xl font-extrabold text-white">404 - Page Not Found</h2>
      <p className="text-xs text-[#71717A] mt-2 max-w-sm">
        The requested luxury salon atelier or booking page does not exist.
      </p>
      <Link
        href="/"
        className="gold-btn mt-6 px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-gold"
      >
        Return Home
      </Link>
    </div>
  );
}
