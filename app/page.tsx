import Hero from "./_components/Hero";
import StatsStrip from "./_components/StatsStrip";
import TrendingDeals from "./_components/TrendingDeals";
import { PopularCityList } from "./_components/PopularCityList";
import WhyUs from "./_components/WhyUs";
import ReviewsTeaser from "./_components/ReviewTeaser";
import CtaBanner from "./_components/CtaBanner";
import Footer from "./_components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <StatsStrip />
        <TrendingDeals />
        <PopularCityList />
        <WhyUs />
        <ReviewsTeaser />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}