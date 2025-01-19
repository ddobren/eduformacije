import { useEffect } from "react";
import { Footer } from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";
import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";

export const Home = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

