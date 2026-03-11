import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import type { Bike } from "@/types/bike";

interface BikeCardProps {
  bike: Bike;
  isWishlisted: boolean;
  onWishlistToggle: (bikeId: string) => void;
  onClick?: (bikeId: string) => void;
}

export default function BikeCard({ bike, isWishlisted, onWishlistToggle, onClick }: BikeCardProps) {
  const { resolvedTheme } = useTheme();
  
  const formatPrice = (price: number) => {
    return `₹ ${price.toFixed(2)} L`;
  };

  const formatKms = (kms: number) => {
    if (kms >= 1000) {
      return `${(kms / 1000).toFixed(1)}k km`;
    }
    return `${kms} km`;
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 cursor-pointer"
      style={{ backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined }}
      onClick={() => onClick?.(bike.id)}
    >
      <div className="relative">
        {bike.imageUrl ? (
          <img
            src={bike.imageUrl}
            alt={`${bike.brand} ${bike.model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-muted rounded" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlistToggle(bike.id); }}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-600 dark:text-gray-400"}`}
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
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {bike.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="bg-[#f7931e] text-white text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
              {bike.year} {bike.brand} {bike.model}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{bike.variant}</p>
          </div>

          {/* Price & EMI */}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold text-[#f7931e]" style={{ fontFamily: "'Noto Serif', serif" }}>
                {formatPrice(bike.price)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">EMI: ₹{bike.emi.toLocaleString()}/mo</p>
            </div>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{formatKms(bike.kmsDriven)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{bike.fuelType}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{bike.transmission}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{bike.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

