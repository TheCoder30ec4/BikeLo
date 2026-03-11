import BikeCard from "./BikeCard";
import type { Bike } from "@/types/bike";

interface BikeGridProps {
  bikes: Bike[];
  wishlistedBikes: Set<string>;
  onWishlistToggle: (bikeId: string) => void;
  onBikeClick?: (bikeId: string) => void;
}

export default function BikeGrid({ bikes, wishlistedBikes, onWishlistToggle, onBikeClick }: BikeGridProps) {
  if (bikes.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No bikes found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bikes.map((bike) => (
        <BikeCard
          key={bike.id}
          bike={bike}
          isWishlisted={wishlistedBikes.has(bike.id)}
          onWishlistToggle={onWishlistToggle}
          onClick={() => onBikeClick && onBikeClick(bike.id)}
        />
      ))}
    </div>
  );
}

