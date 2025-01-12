import React, { useState } from 'react';
import { School } from '../../../types/search';
import { MapPin, Phone, Mail, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientButton } from '../../common/GradientButton';

interface ResultsProps {
  schools: School[];
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ schools, onReset }) => {
  const ensureHttp = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});

  const toggleSchoolExpansion = (schoolId: string) => {
    setExpandedSchools((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  return (
    <div className="w-full">
      <motion.div
        className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-800/60 shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Pronađene škole ({schools.length})
              </h2>
            </div>
            <GradientButton 
              onClick={onReset} 
              className="w-full sm:w-auto text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3"
            >
              Nova pretraga
            </GradientButton>
          </div>

          {schools.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {schools.map((school) => (
                <motion.div
                  key={school._id}
                  className="bg-gray-800/70 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gray-800/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white break-words">
                      {school.Naziv}
                      <span className="block sm:inline text-sm text-gray-400 sm:ml-2">
                        {school.Mjesto}
                      </span>
                    </h3>
                    <button
                      onClick={() => toggleSchoolExpansion(school._id)}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {expandedSchools[school._id] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedSchools[school._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4 text-gray-300 overflow-hidden"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                          <span className="text-base sm:text-lg break-words">
                            {school.Adresa},
                            <br className="sm:hidden" /> {school.PoštanskiBroj} {school.Mjesto}
                          </span>
                        </div>

                        {school.Telefon && (
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                            <a 
                              href={`tel:${school.Telefon.replace(/\s+/g, '')}`}
                              className="text-base sm:text-lg hover:text-primary-400 transition-colors break-words"
                            >
                              {school.Telefon}
                            </a>
                          </div>
                        )}

                        {school.ePošta && (
                          <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                            <a 
                              href={`mailto:${school.ePošta}`} 
                              className="text-base sm:text-lg hover:text-primary-400 transition-colors underline break-words"
                            >
                              {school.ePošta}
                            </a>
                          </div>
                        )}

                        {school.Web && (
                          <div className="flex items-start gap-3">
                            <Globe className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                            <a 
                              href={ensureHttp(school.Web)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-base sm:text-lg hover:text-primary-400 transition-colors break-words"
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
            <p className="text-center text-gray-400 text-lg sm:text-xl font-medium">
              Nema pronađenih škola prema zadanim kriterijumima.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
