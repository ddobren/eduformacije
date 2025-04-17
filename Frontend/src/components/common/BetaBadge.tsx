import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export const BetaBadge = () => {
  return (
    <motion.div
      className="fixed top-20 right-4 z-40 sm:right-8 md:right-12 hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to="/beta-signup" className="block">
        <div className="relative group">
          {/* Pulsing background effect */}
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

          {/* Badge content */}
          <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-blue-500/50 shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Postani Beta Tester</span>

            {/* New badge */}
            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              Novo
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
