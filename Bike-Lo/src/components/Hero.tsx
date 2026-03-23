import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import mock3 from "@/assets/Hero-Image.webp";

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Doorstep", "Dreams", "Journey", "Adventure", "Freedom"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Tile hover color based on theme

  return (
    <section 
      className="hero-section relative pt-10 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >

      {/* Content Layer - Above Tiles */}
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text Content and CTAs */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight overflow-hidden text-black dark:text-white">
                <motion.span 
                  className="block"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  Your Dream Bike,
                </motion.span>
                <motion.span 
                  className="block"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeInOut' }}
                >
                  <span className="hero-highlight">Deliver</span> to
                </motion.span>
                {/* Animated Rotating Text with "Your" prefix */}
                <span 
                  className="relative flex w-full justify-center lg:justify-start items-center overflow-hidden h-[1.2em] md:h-[1.15em]"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  <span className="text-black dark:text-white mr-2">Your</span>
                  <span className="relative flex-1 overflow-hidden h-full">
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute text-[#f7931e]"
                        initial={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        animate={
                          titleNumber === index
                            ? {
                                y: 0,
                                opacity: 1,
                              }
                            : {
                                y: titleNumber > index ? -100 : 100,
                                opacity: 0,
                              }
                        }
                      >
                        {title}
                      </motion.span>
                    ))}
                  </span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <motion.p 
              className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: "'Noto Serif', serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: 'easeInOut' }}
            >
              Buy, sell & service pre-owned bikes with trust. 
              <span className="text-[#f7931e] font-semibold"> 10,000+ certified bikes</span> waiting for you.
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: 'easeInOut' }}
            >
              <Button
                className="hero-btn bg-[#f7931e] hover:bg-[#e6851a] text-white font-bold px-8 py-6 text-lg rounded-md hover:scale-105 transition-transform duration-300"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Contact Us
              </Button>
              <Button
                className="hero-btn bg-[#f7931e] hover:bg-[#e6851a] text-white font-bold px-8 py-6 text-lg rounded-md hover:scale-105 transition-transform duration-300"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Download App
              </Button>
            </motion.div>

            {/* Social Proof Section */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: 'easeInOut' }}
            >
              {/* Avatar Icons Placeholder */}
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full bg-[#f7931e] border-2 border-white"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.9 + i * 0.1, 
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  />
                ))}
              </div>
              
              {/* Rating and Review Text */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1 + i * 0.08,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      <Star className="w-5 h-5 fill-[#f7931e] text-[#f7931e]" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-bold text-black dark:text-white">5.0</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">1000+ happy customers</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Static Image */}
          <motion.div 
            className="flex justify-center lg:justify-end items-center"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
          >
            <div className="relative w-full max-w-xl lg:max-w-3xl xl:max-w-4xl">
              <div className="relative h-[300px] sm:h-[550px] lg:h-[650px] xl:h-[750px] flex items-center justify-center">
                <img
                  src={mock3}
                  alt="Motorcycle"
                  className="w-full h-auto max-h-full object-contain scale-100 sm:scale-110 lg:scale-125 mt-4 sm:mt-12 lg:mt-16"
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        /* Highlight text with gradient underline */
        .hero-highlight {
          position: relative;
          display: inline-block;
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #f7931e, #e6851a);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          animation: expandLine 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.8s;
        }

        @keyframes expandLine {
          to {
            transform: scaleX(1);
          }
        }

        /* Button shine effect */
        .hero-btn {
          position: relative;
          overflow: hidden;
        }

        .hero-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .hero-btn:hover::before {
          left: 100%;
        }
      `}</style>
    </section>
  );
}
