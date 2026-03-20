import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/FilterSidebar";
import BikeGrid from "@/components/BikeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import { getBikes, mapBikeResponseToBike } from "@/services/bikeService";
import type { Bike } from "@/types/bike";

export default function Bikes() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistedBikes, setWishlistedBikes] = useState<Set<string>>(() => {
    const savedWishlist = localStorage.getItem("bikeWishlist");
    if (savedWishlist) {
      try {
        return new Set(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
    return new Set();
  });

  const [bikes, setBikes] = useState<Bike[]>([]);
  const navigate = useNavigate();

  // Fetch bikes from API (requires auth)
  useEffect(() => {
    let mounted = true;
    getBikes()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setBikes(list.map(mapBikeResponseToBike));
      })
      .catch((err) => {
        console.error("Failed to load bikes", err);
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unauthorized") || msg.includes("Invalid") || msg.includes("expired")) {
          navigate("/login", { replace: true });
        }
      });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bikeWishlist", JSON.stringify(Array.from(wishlistedBikes)));
  }, [wishlistedBikes]);

  // Filter bikes based on all criteria
  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
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
  }, [bikes, priceRange, selectedBrands, selectedYear, searchQuery]);

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
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-transparent border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
            Browse Bikes
          </h1>
          <p className="text-gray-600">
            {filteredBikes.length} {filteredBikes.length === 1 ? "bike" : "bikes"} available
          </p>
        </div>
      </div>

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
              onBikeClick={(id) => navigate(`/buy/${encodeURIComponent(id)}`)}
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <BenefitsSection />
    </div>
  );
}

