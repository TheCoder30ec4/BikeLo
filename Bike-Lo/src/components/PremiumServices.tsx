import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import SellForm from "@/components/SellForm";
import illustration from "@/assets/file.svg";
import Exchange from "@/assets/Exchange.svg";
import Finance from "@/assets/Finance.svg";
import Insurance from "@/assets/Insurance.svg";

const services = [
  {
    title: "Find Your Dream Bike",
    description:
      "Choose from a wide range of inspected and certified bikes with 6 month warranty",
    cta: "BUY NOW",
    href: "/buy",
    image: illustration,
  },
  {
    title: "Exchange Vehicle",
    description:
      "Trade in your old vehicle and upgrade to your dream bike with seamless exchange process",
    cta: "EXCHANGE NOW",
    href: "/exchange",
    image: Exchange,
  },
  {
    title: "Lowest Down Payment with Assisted Finance",
    description:
      "Get the best financing options with lowest down payment and expert assistance for easy approval",
    cta: "APPLY NOW",
    href: "/finance",
    image: Finance,
  },
  {
    title: "Vehicle Insurance for 2 Wheel and 4 Wheeler",
    description:
      "Comprehensive insurance coverage for both two-wheelers and four-wheelers with best rates",
    cta: "GET INSURED",
    href: "/insurance",
    image: Insurance,
  },
];

export default function PremiumServices() {
  const { resolvedTheme } = useTheme();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  
  return (
    <section className="premium-services py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p
            className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            QUALITY SERVICE GUARANTEED
          </p>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Premium Services
            <br />
            Perfect Solutions
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="service-card flex flex-col h-full dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl shadow-none hover:shadow-md hover:border-[#f7931e] transition-all duration-300 overflow-hidden"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                backgroundColor: resolvedTheme === 'light' ? '#FFFFFF' : undefined
              }}
            >
              {/* Card Illustration */}
              <CardContent className="flex-none pt-6 pb-2 px-6">
                <div className="card-illustration-container flex justify-center items-center h-44 sm:h-52 lg:h-56">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="card-illustration w-full h-full object-contain"
                  />
                </div>
              </CardContent>

              <CardHeader className="flex-none pt-2">
                <CardTitle
                  className="text-lg font-bold text-black dark:text-white"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardDescription className="flex-grow px-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {service.description}
              </CardDescription>

              <CardFooter className="flex-none mt-auto pt-4">
                <Button
                  className="bg-[#f7931e] hover:bg-[#e6851a] text-white font-semibold px-6 py-2 rounded-md hover:scale-105 transition-transform duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                  onClick={() => {
                    if (service.cta === "GET INSURED") {
                      setIsSellModalOpen(true);
                    }
                  }}
                >
                  {service.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
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

      {/* Sell Form Modal */}
      <Dialog
        open={isSellModalOpen}
        onOpenChange={setIsSellModalOpen}
      >
        <SellForm onSuccess={() => setIsSellModalOpen(false)} />
      </Dialog>
    </section>
  );
}

