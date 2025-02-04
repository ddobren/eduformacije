import type React from "react"
import { useEffect } from "react"
import { Navbar } from "../components/common/Navbar"
import { Footer } from "../components/common/Footer"
import { AnimatedBackground } from "../components/common/AnimatedBackground"
import { ContactContent } from "../components/Contact/ContactContent"
import { motion } from "framer-motion"

export const Contact: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
    >
      <Navbar />
      <main className="flex-grow relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          <ContactContent />
        </div>
      </main>
      <Footer />
    </motion.div>
  )
}

export default Contact

