import PrivacyHeader from "../components/Privacy/PrivacyHeader";
import PrivacyContent from "../components/Privacy/PrivacyContent";
import { useEffect } from "react";
import { Navbar } from "../components/common/Navbar";
import { AnimatedBackground } from "../components/common/AnimatedBackground";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Background */}
        <AnimatedBackground />
        <div className="max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-xl border border-gray-800/50 shadow-xl mt-12">
          <PrivacyHeader />
          <PrivacyContent />
        </div>
      </div>
    </>
  );
};

export default Privacy;
