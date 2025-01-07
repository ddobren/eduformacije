import { Footer } from "../components/common/Footer";
import { AboutContent } from "../components/About/AboutContent";
import { Navbar } from "../components/common/Navbar";
import { AnimatedBackground } from "../components/common/AnimatedBackground";
import { useEffect } from "react";

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
      }, []);

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                {/* Animated Background */}
                <AnimatedBackground />
                <AboutContent />
            </div>
            <Footer />
        </>
    );
};
