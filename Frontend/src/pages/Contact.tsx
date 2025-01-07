import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { AnimatedBackground } from "../components/common/AnimatedBackground";
import { ContactContent } from "../components/Contact/ContactContent";
import { useEffect } from "react";

export const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        {/* Animated Background */}
        <AnimatedBackground />
        <ContactContent />
      </div>
      <Footer />
    </>
  );
};

export default Contact;
