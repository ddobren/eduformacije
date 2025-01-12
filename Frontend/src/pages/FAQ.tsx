import { useEffect } from "react";
import FAQHeader from "../components/FAQ/FAQHeader";
import FAQList from "../components/FAQ/FAQList";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { AnimatedBackground } from "../components/common/AnimatedBackground";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <AnimatedBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <FAQHeader />
          <FAQList />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;

