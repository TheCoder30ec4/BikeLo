import { Badge } from "@/components/ui/badge";
import type { Bike } from "@/types/bike";

interface BikeCardProps {
  bike: Bike;
  isWishlisted: boolean;
  onWishlistToggle: (bikeId: string) => void;
  onClick?: (bikeId: string) => void;
}

export default function BikeCard({ bike, isWishlisted, onWishlistToggle, onClick }: BikeCardProps) {
  const formatPrice = (price: number) => `₹ ${price.toFixed(2)} L`;

  const formatKms = (kms: number) =>
    kms >= 1000 ? `${(kms / 1000).toFixed(1)}k km` : `${kms} km`;

  return (
    <div
      className="group relative bg-white/5 dark:bg-neutral-900/60 border border-white/10 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-[#f7931e]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_20px_50px_rgba(247,147,30,0.08)] transition-all duration-500 cursor-pointer backdrop-blur-sm"
      onClick={() => onClick?.(bike.id)}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        {bike.imageUrl ? (
          <img
            src={bike.imageUrl}
            alt={`${bike.brand} ${bike.model}`}
            className="w-full h-full object-cover grayscale-[30%] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">No Image</span>
          </div>
        )}

        {/* Tags top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {bike.tags?.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#f7931e] text-white text-[10px] px-2 py-0.5 uppercase tracking-wide font-bold italic border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Wishlist top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlistToggle(bike.id); }}
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-black/30 hover:bg-black/50 transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? "fill-[#f7931e] text-[#f7931e]" : "fill-none text-white"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Price overlay bottom-right */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg">
          <span className="text-white font-bold text-base tracking-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
            {formatPrice(bike.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title + location */}
        <div className="space-y-0.5">
          <h3
            className="text-lg font-bold text-black dark:text-white uppercase italic leading-tight group-hover:text-[#f7931e] transition-colors"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {bike.year} {bike.brand} {bike.model}
          </h3>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            {bike.variant}
          </p>
        </div>

        {/* Spec chips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "KMs", value: formatKms(bike.kmsDriven) },
            { label: "Fuel", value: bike.fuelType },
            { label: "Trans", value: bike.transmission },
          ].map((spec) => (
            <div
              key={spec.label}
              className="bg-neutral-100 dark:bg-neutral-800/60 rounded-full px-2 py-1.5 flex flex-col items-center justify-center"
            >
              <span className="text-[9px] uppercase text-neutral-400 font-bold tracking-wider">{spec.label}</span>
              <span className="text-[11px] text-black dark:text-white font-bold truncate w-full text-center">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* EMI + CTA */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-xs text-neutral-500">
            EMI <span className="text-[#f7931e] font-semibold">₹{bike.emi.toLocaleString()}/mo</span>
          </span>
          <button className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 group-hover:text-[#f7931e] border border-neutral-300 dark:border-neutral-700 group-hover:border-[#f7931e]/50 px-3 py-1.5 rounded transition-all">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
