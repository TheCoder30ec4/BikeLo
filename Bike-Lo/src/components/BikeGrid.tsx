import { useState, useMemo } from "react";
import BikeCard from "./BikeCard";
import type { Bike } from "@/types/bike";

interface BikeGridProps {
  bikes: Bike[];
  wishlistedBikes: Set<string>;
  onWishlistToggle: (bikeId: string) => void;
  onBikeClick?: (bikeId: string) => void;
}

type SortOption = "newest" | "price-asc" | "price-desc";

export default function BikeGrid({ bikes, wishlistedBikes, onWishlistToggle, onBikeClick }: BikeGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const sortedBikes = useMemo(() => {
    const copy = [...bikes];
    if (sortBy === "price-asc") return copy.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return copy.sort((a, b) => b.price - a.price);
    return copy.sort((a, b) => b.year - a.year); // newest first
  }, [bikes, sortBy]);

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1
            className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase text-black dark:text-white leading-none"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Catalog
          </h1>
          <p className="text-neutral-400 mt-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold">
            {bikes.length > 0
              ? `Showing ${sortedBikes.length} certified machine${sortedBikes.length !== 1 ? "s" : ""}`
              : "No bikes found"}
          </p>
        </div>
        {bikes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-bold text-[#f7931e] focus:ring-0 focus:border-[#f7931e]/50 cursor-pointer px-3 py-1.5 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {sortedBikes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
            No bikes found
          </h3>
          <p className="text-sm text-neutral-400">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              isWishlisted={wishlistedBikes.has(bike.id)}
              onWishlistToggle={onWishlistToggle}
              onClick={() => onBikeClick && onBikeClick(bike.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
