import Hero from "@/components/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import PremiumServices from "@/components/PremiumServices";
import PopularBikes from "@/components/PopularBikes";
import BrowseByStyle from "@/components/BrowseByStyle";
import BuySellSection from "@/components/BuySellSection";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <BuySellSection />
      <PremiumServices />
      <PopularBikes />
      <BrowseByStyle />
      
    </>
  );
}


