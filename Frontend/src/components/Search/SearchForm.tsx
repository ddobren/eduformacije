import React, { useState, useEffect, useRef } from "react";
import { Search } from 'lucide-react';
import { toast } from "../../utils/toast";
import { School } from "../../types/search";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (results: School[] | null) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearchStart,
  onSearchComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<School[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fuse = useRef<Fuse<School> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        const cachedData = localStorage.getItem("allSchools");
        if (cachedData) {
          const parsedData: School[] = JSON.parse(cachedData);
          initializeFuse(parsedData);
          return;
        }

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0";
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
        ]);

        if (!responseOsnovne.ok || !responseSrednje.ok) {
          throw new Error("Greška prilikom dohvaćanja škola.");
        }

        const [osnovneSkole, srednjeSkole] = await Promise.all([
          responseOsnovne.json(),
          responseSrednje.json(),
        ]);

        const combinedData: School[] = [...osnovneSkole, ...srednjeSkole];
        localStorage.setItem("allSchools", JSON.stringify(combinedData));
        initializeFuse(combinedData);
      } catch {
        toast.error("Greška prilikom učitavanja podataka.");
      }
    };

    const initializeFuse = (schools: School[]) => {
      fuse.current = new Fuse(schools, {
        keys: ["Naziv", "Mjesto"], 
        threshold: 0.4,            
      });
    };

    fetchAllSchools();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.warning("Unesite naziv škole za pretragu.");
      return;
    }

    onSearchStart();

    let filteredResults: School[] = [];
    if (fuse.current) {
      const fuseResults = fuse.current.search(searchTerm, { limit: 50 });
      filteredResults = fuseResults.map((result) => result.item);
    }

    onSearchComplete(filteredResults.length > 0 ? filteredResults : null);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (fuse.current && value.trim()) {
        const results = fuse.current.search(value, { limit: 5 });
        setSuggestions(results.map((result) => result.item));
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(true);
    }
    if (isMobile) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <motion.h1
          className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Edu<span className="text-primary-400">formacije</span>
        </motion.h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto text-center">
          Pretražite sve škole u Hrvatskoj na jednom mjestu
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="relative max-w-3xl mx-auto"
        id="search-form"
      >
        <div className="relative group">
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-400 
                       via-primary-500 to-primary-600 rounded-full blur-md 
                       opacity-75 group-hover:opacity-100 
                       transition-opacity duration-300 pointer-events-none"
          />
          <div className="relative bg-gray-900 rounded-full p-1">
            <div className="flex items-center">
              <input
                autoComplete="off"
                spellCheck={false}
                ref={inputRef}
                type="text"
                placeholder="Pronađi svoju školu..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 
                           text-base sm:text-lg bg-gray-900 text-white 
                           rounded-l-full focus:outline-none 
                           placeholder-gray-400 appearance-none"
                style={{ WebkitAppearance: 'none' }}
              />
              <button
                type="submit"
                className="min-w-[44px] sm:min-w-[100px] 
                           px-3 sm:px-8 py-3 sm:py-4 
                           bg-gradient-to-r from-primary-400 
                           via-primary-500 to-primary-600 
                           text-white rounded-full 
                           hover:opacity-90 active:opacity-80
                           transition-opacity duration-300 
                           flex items-center justify-center gap-2
                           touch-manipulation"
              >
                <Search className="w-4 h-4 flex-shrink-0 transition-colors" />
                <span className="hidden sm:inline">Pretraži</span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={suggestionRef}
              className="fixed sm:absolute left-0 right-0 sm:w-full 
                         mt-2 sm:mt-4 mx-3 sm:mx-0 z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                top: isMobile ? '50%' : 'auto',
                transform: isMobile ? 'translateY(-50%)' : 'none',
              }}
            >
              <div
                className="bg-gray-900/95 rounded-2xl shadow-xl 
                           border border-gray-800/50 backdrop-blur-lg 
                           overflow-hidden max-h-[60vh] sm:max-h-[400px] 
                           overflow-y-auto"
              >
                <ul className="divide-y divide-gray-800 divide-solid">
                  {suggestions.map((suggestion) => (
                    <motion.li
                      key={suggestion._id}
                      className="group"
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.05)",
                      }}
                    >
                      <button
                        type="button"
                        className="w-full px-4 sm:px-6 py-4 
                                   text-left flex items-center gap-3 
                                   sm:gap-4 text-gray-300 hover:text-white 
                                   transition-colors active:bg-gray-800/50"
                        onClick={() => {
                          setSearchTerm(suggestion.Naziv);
                          setShowSuggestions(false);
                          setSuggestions([]);
                          if (inputRef.current) {
                            inputRef.current.focus();
                            if (isMobile) {
                              inputRef.current.blur();
                            }
                          }
                          onSearchComplete([suggestion]);
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {suggestion.Naziv}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {suggestion.Mjesto}
                          </p>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          Pretraži informacije od preko{" "}
          <span className="text-primary-400 font-semibold">1000+</span> škola
        </div>
      </form>
    </motion.div>
  );
};
