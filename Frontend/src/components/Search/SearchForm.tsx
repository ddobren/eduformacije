import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, School as SchoolIcon, MapPin, X } from "lucide-react"
import { toast } from "../../utils/toast"
import type { School } from "../../types/search"
import Fuse from "fuse.js"
import { motion, AnimatePresence } from "framer-motion"
import LoadingState from "./LoadingState"

interface SearchFormProps {
  onSearchStart: () => void
  onSearchComplete: (results: School[] | null) => void
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearchStart, onSearchComplete }) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [suggestions, setSuggestions] = useState<School[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fuse = useRef<Fuse<School> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    
    const resizeHandler = () => {
      checkMobile()
      setShowSuggestions(false)
    }
    
    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        setIsLoading(true)
        
        const cachedData = localStorage.getItem("allSchools")
        const cacheTimestamp = localStorage.getItem("allSchoolsTimestamp")
        const currentTime = new Date().getTime()
        
        if (cachedData && cacheTimestamp && 
            currentTime - parseInt(cacheTimestamp) < 24 * 60 * 60 * 1000) {
          const parsedData: School[] = JSON.parse(cachedData)
          initializeFuse(parsedData)
          setIsLoading(false)
          return
        }

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0"
        
        const [responseOsnovne, responseSrednje] = await Promise.all([
          fetch("https://engine.eduformacije.com/api/v1/skole/osnovne", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://engine.eduformacije.com/api/v1/skole/srednje", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ])

        if (!responseOsnovne.ok || !responseSrednje.ok) {
          throw new Error("Greška prilikom dohvaćanja škola.")
        }

        const [osnovneSkole, srednjeSkole] = await Promise.all([
          responseOsnovne.json(),
          responseSrednje.json(),
        ])

        const combinedData: School[] = [...osnovneSkole, ...srednjeSkole]
        
        localStorage.setItem("allSchools", JSON.stringify(combinedData))
        localStorage.setItem("allSchoolsTimestamp", currentTime.toString())
        
        initializeFuse(combinedData)
      } catch (error) {
        console.error("Error fetching schools:", error)
        toast.error("Greška prilikom učitavanja podataka.")
      } finally {
        setIsLoading(false)
      }
    }

    const initializeFuse = (schools: School[]) => {
      fuse.current = new Fuse(schools, {
        keys: ["Naziv", "Mjesto"],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
      })
    }

    fetchAllSchools()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      toast.warning("Unesite naziv škole za pretragu.")
      return
    }

    onSearchStart()

    let filteredResults: School[] = []
    if (fuse.current) {
      const fuseResults = fuse.current.search(searchTerm, { limit: 50 })
      filteredResults = fuseResults.map((result) => result.item)
    }

    onSearchComplete(filteredResults.length > 0 ? filteredResults : null)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value.trim()) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
      return
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      if (fuse.current && value.trim()) {
        const results = fuse.current.search(value, { limit: 5 })
        setSuggestions(results.map((result) => result.item))
      } else {
        setSuggestions([])
      }
    }, 300)
  }

  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(true)
    }
    
    if (isMobile) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Edu<span className="text-primary-400">formacije</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Pretražite sve škole u Hrvatskoj na jednom mjestu
            </p>
          </motion.div>
        </div>

        <form ref={formRef} onSubmit={handleSearch} className="relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-primary-500/20 to-primary-600/20 rounded-2xl blur-xl opacity-75" />
            
            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
              <div className="flex items-center p-2">
                <div className="relative flex-1 group">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Pronađi svoju školu..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 sm:py-4 bg-transparent text-white placeholder-gray-400 text-base sm:text-lg focus:outline-none transition-colors duration-200"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Pretraži škole"
                    disabled={isLoading}
                  />
                  
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("")
                        setSuggestions([])
                        setShowSuggestions(false)
                        inputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      aria-label="Očisti unos"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="ml-2 px-4 sm:px-6 py-3 sm:py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading || !searchTerm.trim()}
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Pretraži</span>
                </button>
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    ref={suggestionRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full border-t border-gray-800"
                  >
                    <div 
                      className="w-full bg-gray-900"
                      style={{
                        maxHeight: isMobile ? "40vh" : "300px",
                        overflowY: "auto",
                      }}
                    >
                      <ul className="divide-y divide-gray-800">
                        {suggestions.map((suggestion) => (
                          <motion.li
                            key={suggestion._id}
                            className="group"
                            whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.05)" }}
                          >
                            <button
                              type="button"
                              className="w-full px-6 py-4 text-left flex items-start gap-4 transition-colors duration-200 focus:outline-none focus:bg-gray-800/30"
                              onClick={() => {
                                setSearchTerm(suggestion.Naziv)
                                setShowSuggestions(false)
                                setSuggestions([])
                                onSearchStart()
                                onSearchComplete([suggestion])
                              }}
                            >
                              <div className="mt-1 p-2 rounded-lg bg-primary-500/10 flex-shrink-0">
                                <SchoolIcon className="w-5 h-5 text-primary-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium line-clamp-1">{suggestion.Naziv}</p>
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{suggestion.Mjesto}</span>
                                </div>
                              </div>
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            className="mt-4 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                Pretraži informacije od preko <span className="text-primary-400 font-semibold">1000+</span> škola
              </>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
