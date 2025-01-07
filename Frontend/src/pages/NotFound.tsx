import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const NotFound: React.FC = () => {
    useEffect(() => {
      window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
    }, []);

  return (
    <>
      <AnimatedBackground />
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animirani naslov */}
        <motion.h1
          className="text-6xl sm:text-7xl font-extrabold text-white tracking-500 mb-4"
          initial={{ scale: 0.8, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          404
        </motion.h1>

        {/* Animirani opis */}
        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Oops! Stranica koju tražite ne postoji. 
          Možda je uklonjena ili ste unijeli pogrešan URL.
        </motion.p>

        {/* Gumb za povratak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-2xl"
          >
            Povratak na početnu
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};
