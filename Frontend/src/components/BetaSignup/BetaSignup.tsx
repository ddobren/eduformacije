"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Send, CheckCircle, Sparkles, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { AnimatedBackground } from "../common/AnimatedBackground"
import { motion, AnimatePresence } from "framer-motion"

// Simple math CAPTCHA generator
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return {
    question: `${num1} + ${num2}`,
    answer: (num1 + num2).toString(),
  }
}

export default function BetaSignupPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // CAPTCHA state
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState("")
  const [captchaError, setCaptchaError] = useState("")

  // Regenerate CAPTCHA when component mounts
  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setCaptchaInput("")
    setCaptchaError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setError("")
    setCaptchaError("")

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Molimo unesite valjanu email adresu")
      return
    }

    // CAPTCHA validation
    if (captchaInput !== captcha.answer) {
      setCaptchaError("Netočan odgovor. Pokušajte ponovno.")
      refreshCaptcha()
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      // Replace with actual API call when ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch {
      setError("Došlo je do greške. Molimo pokušajte ponovno.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-950">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Natrag na početnu
        </Link>

        <motion.div
          className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Ekskluzivni pristup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Beta Program</h1>
            <p className="text-gray-300 max-w-sm mx-auto">
              Pridružite se našem beta programu i budite među prvima koji će isprobati nove funkcionalnosti.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email adresa
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vasa@email.com"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </div>

                {/* CAPTCHA Section */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="captcha" className="block text-sm font-medium text-gray-300">
                      Sigurnosna provjera
                    </label>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Osvježi
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/70 border border-gray-700 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20">
                        <ShieldCheck className="h-4 w-4 text-primary-400" />
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                      <div className="text-sm text-white font-medium">Koliko je {captcha.question}?</div>
                      <input
                        type="text"
                        id="captcha"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="w-16 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-white text-center"
                        required
                      />
                    </div>
                  </div>

                  {captchaError && <p className="text-red-400 text-sm">{captchaError}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Prijava u tijeku...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Prijavi se za beta testiranje
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Prijavom pristajete na primanje obavijesti o beta programu. Vaše podatke nećemo dijeliti s trećim
                  stranama.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-500/20 p-3">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Uspješna prijava!</h3>
                <p className="text-gray-300 mb-6">
                  Hvala na interesu za naš beta program. Obavijestit ćemo vas putem emaila kada budete odabrani za
                  testiranje.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Povratak na početnu
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
