import { Link } from "react-router-dom";

interface BikeCategory {
  id: number;
  name: string;
  image: string;
  slug: string;
}

const categories: BikeCategory[] = [
  {
    id: 1,
    name: "Scooter",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/activa-6g-right-front-three-quarter.jpeg?isig=0&q=80",
    slug: "scooter",
  },
  {
    id: 2,
    name: "Commuter",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/107749/splendor-plus-right-front-three-quarter.jpeg?isig=0&q=80",
    slug: "commuter",
  },
  {
    id: 3,
    name: "Sports",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/124663/390-duke-right-front-three-quarter.jpeg?isig=0&q=80",
    slug: "sports",
  },
  {
    id: 4,
    name: "Tourer",
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106029/dominar-400-right-front-three-quarter-3.jpeg?isig=0&q=80",
    slug: "tourer",
  },
];

export default function BrowseByStyle() {
  return (
    <section className="browse-by-style py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center mb-8 lg:mb-10"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          Browse By Style
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/bikes?style=${category.slug}`}
              className="category-card group bg-transparent border border-gray-300 rounded-lg shadow-none hover:shadow-md hover:border-[#f7931e] transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="p-4 sm:p-5 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={`${category.name} bikes`}
                  className="w-full h-28 sm:h-32 lg:h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Category Label */}
              <div className="pb-4 sm:pb-5">
                <p
                  className="text-center text-base sm:text-lg font-medium text-black dark:text-white group-hover:text-[#f7931e] transition-colors duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .category-card {
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




