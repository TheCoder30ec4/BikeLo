import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { brands, yearOptions } from "@/data/mockBikes";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandsChange,
  selectedYear,
  onYearChange,
  searchQuery,
  onSearchChange,
}: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === "min") {
      setMinPrice(value);
      onPriceRangeChange([numValue, priceRange[1]]);
    } else {
      setMaxPrice(value);
      onPriceRangeChange([priceRange[0], numValue]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const handleReset = () => {
    onSearchChange("");
    onPriceRangeChange([0, 3]);
    setMinPrice("0");
    setMaxPrice("3");
    onBrandsChange([]);
    onYearChange(null);
  };

  const FilterContent = (
    <div className="space-y-7">
      {/* Search */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7931e]">Search</p>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#f7931e] transition-colors" />
          <Input
            id="search"
            type="text"
            placeholder="Brand or Model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 focus:border-[#f7931e]/50 focus:ring-[#f7931e]/20 text-black dark:text-white placeholder:text-neutral-400 rounded-lg h-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7931e]">Price Range</p>
          <span className="text-[10px] font-mono text-neutral-400">
            ₹{priceRange[0].toFixed(1)}L – ₹{priceRange[1].toFixed(1)}L
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-9 text-sm rounded-lg"
            min={0}
            step={0.1}
          />
          <span className="text-neutral-400 text-sm">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-black dark:text-white h-9 text-sm rounded-lg"
            min={0}
            step={0.1}
          />
        </div>
        <div className="space-y-1.5 px-1">
          <input
            type="range"
            min={0} max={3} step={0.1}
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([parseFloat(e.target.value), priceRange[1]])}
            className="w-full h-1.5 rounded-full appearance-none bg-neutral-200 dark:bg-neutral-700 accent-[#f7931e] cursor-pointer"
          />
          <input
            type="range"
            min={0} max={3} step={0.1}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseFloat(e.target.value)])}
            className="w-full h-1.5 rounded-full appearance-none bg-neutral-200 dark:bg-neutral-700 accent-[#f7931e] cursor-pointer"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7931e]">Brand</p>
        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandToggle(brand)}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-full border transition-all duration-200 ${
                selectedBrands.includes(brand)
                  ? "bg-[#f7931e] border-[#f7931e] text-white"
                  : "bg-neutral-100 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-[#f7931e]/50 hover:text-[#f7931e]"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7931e]">Year</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onYearChange(null)}
            className={`py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg border transition-all ${
              selectedYear === null
                ? "bg-[#f7931e] border-[#f7931e] text-white"
                : "bg-neutral-100 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-[#f7931e]/40"
            }`}
          >
            All
          </button>
          {yearOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onYearChange(opt.value)}
              className={`py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg border transition-all ${
                selectedYear === opt.value
                  ? "bg-[#f7931e] border-[#f7931e] text-white"
                  : "bg-neutral-100 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-[#f7931e]/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="w-full py-3 bg-gradient-to-r from-[#f7931e] to-[#e6851a] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
        style={{ fontFamily: "'Noto Serif', serif" }}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto p-6 gap-2 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <div className="mb-2">
          <h2
            className="text-2xl font-black italic tracking-tight text-black dark:text-white"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Filters
          </h2>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400 mt-0.5">
            Refine Your Machine
          </p>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="block lg:hidden w-full mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-11 text-sm font-bold uppercase tracking-widest border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <SlidersHorizontal className="h-4 w-4 text-[#f7931e]" />
              <span className="text-black dark:text-white">Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[380px] overflow-y-auto bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800">
            <SheetHeader>
              <SheetTitle
                className="text-xl font-black italic tracking-tight text-black dark:text-white"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Filters
              </SheetTitle>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Refine Your Machine</p>
            </SheetHeader>
            <div className="mt-6">{FilterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
