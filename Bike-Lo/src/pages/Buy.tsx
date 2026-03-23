import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/FilterSidebar";
import BikeGrid from "@/components/BikeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import { getBikes, mapBikeResponseToBike } from "@/services/bikeService";
import type { Bike } from "@/types/bike";

export default function Buy() {
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

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bikeWishlist", JSON.stringify(Array.from(wishlistedBikes)));
  }, [wishlistedBikes]);

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

  const handleBikeClick = (bikeId: string) => {
    navigate(`/buy/${encodeURIComponent(bikeId)}`);
  };

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
    <div className="flex min-h-screen pt-16">
      {/* Sidebar — sticky, full height (desktop only; mobile uses Sheet) */}
      <div className="hidden lg:block flex-shrink-0 px-4 sm:px-6 py-8">
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

      {/* Main content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8 space-y-10 overflow-y-auto">
        {/* Mobile filter trigger */}
        <div className="block lg:hidden">
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

        {/* Bike grid with catalog header */}
        <BikeGrid
          bikes={filteredBikes}
          wishlistedBikes={wishlistedBikes}
          onWishlistToggle={handleWishlistToggle}
          onBikeClick={handleBikeClick}
        />

        {/* Benefits */}
        <BenefitsSection />
      </div>
    </div>
  );
}
