import { ChevronDown } from "lucide-react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest <= 50)
  })

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector("#features")
    featuresSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.div
      className="absolute bottom-8 left-0 w-full flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="p-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-sm hover:bg-primary-500/20 transition-all duration-300"
        onClick={scrollToFeatures}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-primary-400" />
        </motion.div>
      </motion.button>
    </motion.div>
  )
}
