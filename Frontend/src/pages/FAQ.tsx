import { useEffect } from "react";
import FAQHeader from "../components/FAQ/FAQHeader";
import FAQList from "../components/FAQ/FAQList";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { AnimatedBackground } from "../components/common/AnimatedBackground";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Background */}
        <AnimatedBackground />
        <div className="max-w-3xl lg:max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-xl border border-gray-800/50 shadow-xl mt-12">
          <FAQHeader />
          <FAQList />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
