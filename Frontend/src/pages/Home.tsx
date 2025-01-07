import { useEffect } from "react";
import { Footer } from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";
import { Hero } from "../components/Home/Hero";

export const Home = () => {
    useEffect(() => {
      window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
    }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
};
