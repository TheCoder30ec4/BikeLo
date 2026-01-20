import { useState, useMemo, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import BikeGrid from "@/components/BikeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import { mockBikes } from "@/data/mockBikes";

export default function Buy() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistedBikes, setWishlistedBikes] = useState<Set<string>>(new Set());

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("bikeWishlist");
    if (savedWishlist) {
      try {
        const wishlistArray = JSON.parse(savedWishlist);
        setWishlistedBikes(new Set(wishlistArray));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bikeWishlist", JSON.stringify(Array.from(wishlistedBikes)));
  }, [wishlistedBikes]);

  // Filter bikes based on all criteria
  const filteredBikes = useMemo(() => {
    return mockBikes.filter((bike) => {
      // Price filter
      if (bike.price < priceRange[0] || bike.price > priceRange[1]) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) {
        return false;
      }

      // Year filter
      if (selectedYear !== null && bike.year < selectedYear) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchText = `${bike.brand} ${bike.model} ${bike.variant}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [priceRange, selectedBrands, selectedYear, searchQuery]);

  const handleWishlistToggle = (bikeId: string) => {
    setWishlistedBikes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bikeId)) {
        newSet.delete(bikeId);
      } else {
        newSet.add(bikeId);
      }
      return newSet;
    });
  };

  return (
    <div className="pt-16">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Bike Grid */}
          <div className="flex-1">
            <BikeGrid
              bikes={filteredBikes}
              wishlistedBikes={wishlistedBikes}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <BenefitsSection />
    </div>
  );
}
