"use client";

import Link from "next/link";
import { Star } from "lucide-react";

export function FloatingCTA() {
  return (
    <div className="fixed z-50 bottom-6 right-6 md:top-1/2 md:-translate-y-1/2 md:bottom-auto">
      <div className="relative group flex items-center">
        {/* Tooltip Card (Hidden by default, shown on hover, hidden entirely on mobile) */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden md:block">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            Go Premium
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unlock direct HR emails, exclusive off-campus drives, and premium interview prep.
          </p>
          {/* Arrow pointing to the button */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 border-r border-t border-gray-100 dark:border-gray-700 rotate-45" />
        </div>

        {/* Floating Button */}
        <Link
          href="/premium"
          className="flex items-center justify-center w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="Get Premium"
        >
          <Star className="w-6 h-6 fill-current" />
        </Link>
      </div>
    </div>
  );
}
