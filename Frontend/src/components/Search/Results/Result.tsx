import React, { useState } from "react";
import { School } from "../../../types/search";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "../../common/GradientButton";

interface ResultsProps {
  schools: School[];
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ schools, onReset }) => {
  // Osiguraj da link uvijek krene s http/https
  const ensureHttp = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  // Stanje (otvoreno/zatvoreno) za svaku školu
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});

  const toggleSchoolExpansion = (schoolId: string) => {
    setExpandedSchools((prev) => ({
      ...prev,
      [schoolId]: !prev[schoolId],
    }));
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Omot */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-md p-4 sm:p-6 lg:p-8 
                     rounded-2xl border border-gray-800/60 shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Zaglavlje */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Pronađene škole ({schools.length})
              </h2>
            </div>
            <GradientButton
              onClick={onReset}
              className="w-full sm:w-auto text-sm sm:text-base md:text-lg 
                         px-4 py-2 sm:px-6 sm:py-3"
            >
              Nova pretraga
            </GradientButton>
          </div>

          {schools.length > 0 ? (
            <div className="space-y-5 sm:space-y-6">
              {schools.map((school) => (
                <motion.div
                  key={school._id}
                  className="bg-gray-800/70 rounded-xl p-4 sm:p-5 shadow-lg 
                             transition-all duration-300 ease-in-out 
                             hover:shadow-2xl hover:bg-gray-800/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Gornji red: Naziv i "toggle" ikona */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white break-words">
                      {school.Naziv}
                      <span className="block sm:inline text-xs sm:text-sm md:text-base text-gray-400 sm:ml-2">
                        {school.Mjesto}
                      </span>
                    </h3>
                    <button
                      onClick={() => toggleSchoolExpansion(school._id)}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {expandedSchools[school._id] ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </button>
                  </div>

                  {/* Ekspandirajući dio */}
                  <AnimatePresence>
                    {expandedSchools[school._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4 text-gray-300 overflow-hidden"
                      >
                        {/* Adresa */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base leading-snug break-words">
                            {school.Adresa}, {school.PoštanskiBroj} {school.Mjesto}
                          </span>
                        </div>
                        {/* Telefon */}
                        {school.Telefon && (
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <a
                              href={`tel:${school.Telefon.replace(/\s+/g, "")}`}
                              className="text-sm sm:text-base leading-snug hover:text-primary-400 transition-colors break-words"
                            >
                              {school.Telefon}
                            </a>
                          </div>
                        )}
                        {/* E-mail */}
                        {school.ePošta && (
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <a
                              href={`mailto:${school.ePošta}`}
                              className="text-sm sm:text-base leading-snug hover:text-primary-400 transition-colors underline break-words"
                            >
                              {school.ePošta}
                            </a>
                          </div>
                        )}
                        {/* Web */}
                        {school.Web && (
                          <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <a
                              href={ensureHttp(school.Web)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm sm:text-base leading-snug hover:text-primary-400 transition-colors break-words"
                            >
                              {school.Web}
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-base sm:text-lg font-medium mt-8">
              Nema pronađenih škola prema zadanim kriterijima.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
