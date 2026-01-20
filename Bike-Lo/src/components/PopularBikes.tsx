import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

interface Bike {
  id: number;
  name: string;
  price: string;
  emi: string;
  image: string;
}

const popularBikes: Bike[] = [
  {
    id: 1,
    name: "Bajaj Pulsar NS 390",
    price: "1,10,000",
    emi: "2,390/mo",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/124013/pulsar-ns400z-right-front-three-quarter.jpeg?isig=0&q=80",
  },
  {
    id: 2,
    name: "Royal Enfield Classic 350",
    price: "1,30,000",
    emi: "3,390/mo",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/155143/classic-350-right-front-three-quarter-2.jpeg?isig=0&q=80",
  },
  {
    id: 3,
    name: "KTM Duke 390",
    price: "1,90,000",
    emi: "3,990/mo",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/124663/390-duke-right-front-three-quarter.jpeg?isig=0&q=80",
  },
];

export default function PopularBikes() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { resolvedTheme } = useTheme();

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="popular-bikes py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center mb-8 lg:mb-10"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          See What's Popular
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {popularBikes.map((bike, index) => (
            <div
              key={bike.id}
              className="bike-card dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg shadow-none hover:shadow-md hover:border-[#f7931e] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined
              }}
            >
              {/* Image Container */}
              <div className="relative bg-transparent p-3 sm:p-4">
                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(bike.id)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-800 hover:border-[#f7931e] transition-colors duration-200"
                  aria-label={
                    wishlist.includes(bike.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={wishlist.includes(bike.id) ? "#f7931e" : "none"}
                    stroke={wishlist.includes(bike.id) ? "#f7931e" : "#9ca3af"}
                    strokeWidth="2"
                    className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>

                {/* Bike Image */}
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-32 sm:h-36 lg:h-40 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-4">
                {/* Bike Name */}
                <h3
                  className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {bike.name}
                </h3>

                {/* Price */}
                <p
                  className="text-lg sm:text-xl font-bold text-black dark:text-white mb-0.5"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {bike.price}
                </p>

                {/* EMI */}
                <p className="text-xs sm:text-sm text-[#f7931e] font-medium">
                  EMI from {bike.emi}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8 lg:mt-10 text-center">
          <Link to="/bikes">
            <Button
              className="bg-[#f7931e] hover:bg-[#e6851a] text-white font-semibold px-6 py-3 text-sm sm:text-base rounded-lg hover:scale-105 transition-transform duration-300"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Browse All Bikes
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .bike-card {
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

