"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#0B0B0D]">
      <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">Something went wrong</h2>
      <p className="text-xs text-[#71717A] mt-2 max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex items-center space-x-3 mt-6">
        <button
          onClick={() => reset()}
          className="gold-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[#141418] border border-white/[0.08] text-xs text-white uppercase tracking-wider"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
