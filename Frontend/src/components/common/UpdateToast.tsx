import { X, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface UpdateToastProps {
  message?: string
  duration?: number | null // null means it won't auto-dismiss
}

export const UpdateToast = ({
  message = "Aplikacija je ažurirana na najnovije programe obrazovanja!",
  duration = null,
}: UpdateToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-md px-4 sm:px-0"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative overflow-hidden rounded-lg border border-primary-500/30 bg-gray-900/80 backdrop-blur-md shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-transparent" />

            <div className="relative flex items-center gap-3 p-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20">
                  <AlertCircle className="h-5 w-5 text-primary-400" />
                </div>
              </div>

              <div className="flex-1 text-sm text-gray-200">{message}</div>

              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="sr-only">Zatvori</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            <motion.div
              className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
              initial={{ width: "100%" }}
              animate={{ width: duration ? "0%" : "100%" }}
              transition={{ duration: duration ? duration / 1000 : 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
