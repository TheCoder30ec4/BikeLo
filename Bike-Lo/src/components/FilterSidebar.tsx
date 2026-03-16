import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
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
  const { resolvedTheme } = useTheme();
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

  const FilterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-black dark:text-white">Search Brand/Model</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-black dark:text-white">Price Range (₹ Lakhs)</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="w-full"
            min={0}
            step={0.1}
          />
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="w-full"
            min={0}
            step={0.1}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([parseFloat(e.target.value), priceRange[1]])}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#f7931e]"
          />
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseFloat(e.target.value)])}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#f7931e]"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          ₹ {priceRange[0].toFixed(2)}L - ₹ {priceRange[1].toFixed(2)}L
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <Label className="text-black dark:text-white">Brand</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="accent-[#f7931e]"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer text-black dark:text-white"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div className="space-y-3">
        <Label className="text-black dark:text-white">Year</Label>
        <RadioGroup>
          <div className="space-y-2">
            <RadioGroupItem
              id="year-all"
              name="year"
              checked={selectedYear === null}
              onChange={() => onYearChange(null)}
              label="All Years"
            />
            {yearOptions.map((option) => (
              <RadioGroupItem
                key={option.value}
                id={`year-${option.value}`}
                name="year"
                checked={selectedYear === option.value}
                onChange={() => onYearChange(option.value)}
                label={option.label}
              />
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <aside 
        className="hidden lg:block w-80 space-y-6 p-6 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg h-fit sticky top-24"
        style={{ backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined }}
      >
        <div>
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
            Filters
          </h2>
        </div>
        {FilterContent}
      </aside>

      {/* Mobile View */}
      <div className="block lg:hidden w-full mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold border-gray-300 dark:border-gray-700"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <SlidersHorizontal className="h-5 w-5 text-[#f7931e]" />
              <span className="text-black dark:text-white">Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left font-bold text-xl" style={{ fontFamily: "'Noto Serif', serif" }}>
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {FilterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

