import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import Inspection from "@/assets/Inspection.webp";
import EngineWarranty from "@/assets/6MonthsWarranty.webp";
import Servicing from "@/assets/servicing.webp";
import Insurance from "@/assets/Insurance.webp";
import RC from "@/assets/RCTransfer.webp"



// Benefits data for Buy tab
const benefits = [
  {
    id: 1,
    title: "75 Points Inspection",
    description: "Every bike is carefully han dpicked after a thorough 75-point quality inspection.",
    image: Inspection,
    icon: "🔍",
  },
  {
    id: 2,
    title: "6 Months Engine Warranty",
    description: "Comprehensive engine warranty coverage for 6 months to ensure your peace of mind.",
    image: EngineWarranty,
    icon: "🛡️",
  },
  {
    id: 3,
    title: "2 Free Service",
    description: "Get 2 complimentary service sessions to keep your bike in perfect condition.",
    image: Servicing,
    icon: "🔧",
  },
  {
    id: 4,
    title: "1-Year Free Insurance",
    description: "Enjoy complete protection with 1 year of free insurance coverage included.",
    image: Insurance,
    icon: "📋",
  },
  {
    id: 5,
    title: "100% RC Transfer Assurance",
    description: "Complete assurance with 100% RC transfer assurance.",
    image: RC,
    icon: "✓",
  },
];

// Brands data for Sell tab
const brands = [
  { id: 1, name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/100px-Honda_Logo.svg.png" },
  { id: 2, name: "Yamaha", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Yamaha_Motor_logo.svg/100px-Yamaha_Motor_logo.svg.png" },
  { id: 3, name: "Suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/100px-Suzuki_logo_2.svg.png" },
  { id: 4, name: "Bajaj", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bajaj_Auto_Logo.svg/100px-Bajaj_Auto_Logo.svg.png" },
  { id: 5, name: "TVS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/TVS_Motor_Company_Logo.svg/100px-TVS_Motor_Company_Logo.svg.png" },
  { id: 6, name: "KTM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/KTM-Logo.svg/100px-KTM-Logo.svg.png" },
  { id: 7, name: "Royal Enfield", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Royal_Enfield_logo.svg/100px-Royal_Enfield_logo.svg.png" },
  { id: 8, name: "Hero", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/100px-Hero_MotoCorp_Logo.svg.png" },
];

const sellingPoints = [
  { icon: "⚡", text: "Instant online quote" },
  { icon: "📋", text: "Free bike evaluation" },
  { icon: "💳", text: "Same day payment" },
];

export default function BuySellSection() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  return (
    <section className="buy-sell-section py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <div className="inline-flex border border-gray-300 rounded-full p-1 bg-transparent">
            <button
              onClick={() => setActiveTab("buy")}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === "buy"
                  ? "bg-[#f7931e] text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-[#f7931e]"
              }`}
              style={{ fontFamily: "'Noto Serif', serif" }}
              role="tab"
              aria-selected={activeTab === "buy"}
              aria-controls="buy-panel"
            >
              Buy Bike
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === "sell"
                  ? "bg-[#f7931e] text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-[#f7931e]"
              }`}
              style={{ fontFamily: "'Noto Serif', serif" }}
              role="tab"
              aria-selected={activeTab === "sell"}
              aria-controls="sell-panel"
            >
              Sell Bike
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* BUY TAB */}
          <div
            id="buy-panel"
            role="tabpanel"
            className={`transition-all duration-500 ${
              activeTab === "buy" ? "opacity-100 block" : "opacity-0 hidden"
            }`}
          >
            {/* Section Heading */}
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center mb-8 lg:mb-10"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Bikelo Benefits
            </h2>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8 lg:mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className="benefit-card border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md hover:border-[#f7931e] transition-all duration-300 group"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined
                  }}
                >
                  {/* Image with Icon Overlay */}
                  <div className="relative">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-32 sm:h-36 object-cover"
                      loading="lazy"
                    />
                    {/* Icon Overlay */}
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                      <span className="text-lg">{benefit.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="p-4 dark:bg-transparent"
                    style={{ backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined }}
                  >
                    <h3
                      className="text-base font-bold text-black dark:text-white mb-2 group-hover:text-[#f7931e] transition-colors duration-300"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link to="/bikes">
                <Button
                  className="bg-[#f7931e] hover:bg-[#e6851a] text-white font-semibold px-8 py-3 text-base rounded-lg hover:scale-105 transition-transform duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Browse Bikes
                </Button>
              </Link>
              <Link
                to="/about"
                className="text-[#f7931e] font-medium hover:underline flex items-center gap-1"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* SELL TAB */}
          <div
            id="sell-panel"
            role="tabpanel"
            className={`transition-all duration-500 ${
              activeTab === "sell" ? "opacity-100 block" : "opacity-0 hidden"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left: Video/Image Block */}
              <div className="relative rounded-lg overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop"
                  alt="Sell your bike"
                  className="w-full h-48 sm:h-80 lg:h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  {/* Play Button */}
                  <button
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300 shadow-lg"
                    aria-label="Play video"
                  >
                    <svg className="w-6 h-6 text-[#f7931e] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <p
                    className="text-white text-xl sm:text-2xl font-bold text-center px-4"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    Sell your bike for the
                    <br />
                    best price
                  </p>
                </div>
              </div>

              {/* Right: Brand Selection */}
              <div>
                {/* Heading */}
                <h2
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-black dark:text-white mb-4"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Select your bike brand to get started
                </h2>

                {/* Selling Points */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
                  {sellingPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-[#f7931e]">{point.icon}</span>
                      <span>{point.text}</span>
                    </div>
                  ))}
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`brand-card p-3 sm:p-4 dark:bg-transparent border rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:shadow-md ${
                        selectedBrand === brand.id
                          ? "border-[#f7931e] shadow-md"
                          : "border-gray-300 dark:border-gray-700 hover:border-[#f7931e]"
                      }`}
                      style={{ backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined }}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-6 sm:h-8 object-contain"
                        loading="lazy"
                      />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {brand.name}
                      </span>
                    </button>
                  ))}
                  {/* More Button */}
                  <button
                    className="p-3 sm:p-4 dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:border-[#f7931e] hover:shadow-md"
                    style={{ backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined }}
                  >
                    <span
                      className="text-sm font-bold text-black dark:text-white"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      MORE
                    </span>
                  </button>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-[#f7931e] hover:bg-[#e6851a] text-white font-semibold py-4 text-base rounded-lg hover:scale-[1.02] transition-transform duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Get Price
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .benefit-card,
        .brand-card {
          opacity: 0;
          transform: translateY(20px);
          animation: cardFadeIn 0.6s ease-out forwards;
        }

        @keyframes cardFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}




