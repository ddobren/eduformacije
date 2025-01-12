import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
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
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fuse = useRef<Fuse<School> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        const cachedData = localStorage.getItem("allSchools");
        if (cachedData) {
          const parsedData: School[] = JSON.parse(cachedData);
          initializeFuse(parsedData);
          return;
        }
        const response = await fetch(
          "https://engine.eduformacije.com/api/v1/skole"
        );
        const data: School[] = await response.json();
        localStorage.setItem("allSchools", JSON.stringify(data));
        initializeFuse(data);
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
      if (fuse.current) {
        const results = fuse.current.search(value, { limit: 5 });
        setSuggestions(results.map((result) => result.item));
      }
    }, 300);
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo + opis */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {/* Umetnemo hr logo */}
        <motion.h1
          className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Edu<span className="text-primary-400">formacije</span>
        </motion.h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4 text-center">
          Pretražite sve škole u <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent font-bold">Hrvatskoj</span> na jednom mjestu.
        </p>
      </div>

      {/* Forma za pretragu */}
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
                       transition-opacity duration-300"
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
                className="w-full px-4 sm:px-6 py-3 sm:py-4 
                           text-base sm:text-lg bg-gray-900 text-white 
                           rounded-l-full focus:outline-none 
                           placeholder-gray-400"
              />
              <button
                type="submit"
                className="min-w-[44px] sm:min-w-[100px] 
                           px-3 sm:px-8 py-3 sm:py-4 
                           bg-gradient-to-r from-primary-400 
                           via-primary-500 to-primary-600 
                           text-white rounded-full 
                           hover:opacity-90 
                           transition-opacity duration-300 
                           flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 flex-shrink-0 transition-colors" />
                <span className="hidden sm:inline">Pretraži</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sugestije */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              className="fixed sm:absolute left-0 right-0 sm:w-full 
                         mt-2 sm:mt-4 mx-3 sm:mx-0 z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-gray-900 rounded-2xl shadow-xl 
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
                                   transition-colors"
                        onClick={() => {
                          setSearchTerm(suggestion.Naziv);
                          setShowSuggestions(false);
                          if (inputRef.current) inputRef.current.focus();
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

        {/* Donji info */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-4">
          Pretraži informacije od preko{" "}
          <span className="text-primary-400 font-semibold">1000+</span> škola
        </div>
      </form>
    </motion.div>
  );
};
