import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/file.svg";

const services = [
  {
    title: "Find Your Dream Bike",
    description:
      "Choose from a wide range of inspected and certified bikes with 6 month warranty",
    cta: "BUY NOW",
    href: "/buy",
  },
  {
    title: "Get The Best Deal",
    description:
      "Sell your bike quickly with guaranteed paper transfer and assured buy-back option",
    cta: "SELL NOW",
    href: "/sell",
  },
  {
    title: "EMI Offers",
    description:
      "Lowest interest rates : starting from 11% Maximum funding up to 98% on road price",
    cta: "APPLY",
    href: "/emi",
  },
  {
    title: "Export Bike",
    description:
      "6 months warranty on bike Free service 3 months RC transfer in 15 days",
    cta: "KNOW MORE",
    href: "/export",
  },
];

export default function PremiumServices() {
  return (
    <section className="premium-services py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p
            className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 uppercase mb-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            QUALITY SERVICE GUARANTEED
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Premium Services
            <br />
            Perfect Solutions
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="service-card flex flex-col h-full bg-transparent border border-gray-300 rounded-xl shadow-none hover:shadow-md hover:border-[#f7931e] transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Illustration */}
              <CardContent className="flex-none pt-6 pb-2 px-6">
                <div className="card-illustration-container flex justify-center items-center h-44 sm:h-52 lg:h-56">
                  <img
                    src={illustration}
                    alt={service.title}
                    className="card-illustration w-full h-full object-contain"
                  />
                </div>
              </CardContent>

              <CardHeader className="flex-none pt-2">
                <CardTitle
                  className="text-lg font-bold text-black"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardDescription className="flex-grow px-6 text-sm text-gray-500 leading-relaxed">
                {service.description}
              </CardDescription>

              <CardFooter className="flex-none mt-auto pt-4">
                <Button
                  className="bg-[#f7931e] hover:bg-[#e6851a] text-white font-semibold px-6 py-2 rounded-md hover:scale-105 transition-transform duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {service.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Storyset Attribution */}
        <div className="mt-8 text-center">
          <a
            href="https://storyset.com/people"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-[#f7931e] transition-colors duration-300"
          >
            Illustrations by Storyset
          </a>
        </div>
      </div>

      <style>{`
        .service-card {
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

        .card-illustration-container {
          background: transparent;
        }

        .card-illustration {
          background: transparent;
          mix-blend-mode: multiply;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .service-card:hover .card-illustration {
          transform: scale(1.05);
          opacity: 1;
        }

        /* Remove any SVG background */
        .card-illustration svg,
        .card-illustration img {
          background: transparent !important;
        }
      `}</style>
    </section>
  );
}

