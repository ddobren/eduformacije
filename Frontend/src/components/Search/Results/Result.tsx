import React, { useState } from 'react';
import { School } from '../../../types/search';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
  const [expandedPhones, setExpandedPhones] = useState<Record<string, boolean>>({});

  const toggleEmails = (schoolId: string) => {
    setExpandedEmails((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  const togglePhones = (schoolId: string) => {
    setExpandedPhones((prev) => ({ ...prev, [schoolId]: !prev[schoolId] }));
  };

  return (
    <div className="min-h-screen w-full">
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
              {schools.map((school) => {
                const allEmails = school.ePošta
                  ? school.ePošta.split(/[,;]+/).map((e) => e.trim()).filter(Boolean)
                  : [];

                const allPhones = school.Telefon
                  ? school.Telefon.split(/[,;]+/).map((p) => p.trim()).filter(Boolean)
                  : [];

                return (
                  <motion.div
                    key={school._id}
                    className="bg-gray-800/70 rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gray-800/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 break-words">{school.Naziv}</h3>

                    <div className="space-y-4 text-gray-300">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                        <span className="text-base sm:text-lg break-words">
                          {school.Adresa},
                          <br className="sm:hidden" /> {school.PoštanskiBroj} {school.Mjesto}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                        <div className="flex flex-col">
                          {allPhones.length === 0 ? (
                            <span className="text-sm italic text-gray-500">Nema broja telefona</span>
                          ) : (
                            <>
                              {allPhones.slice(0, expandedPhones[school._id] ? allPhones.length : 1).map((phone, idx) => (
                                <a 
                                  key={idx} 
                                  href={`tel:${phone.replace(/\s+/g, '')}`}
                                  className="text-base sm:text-lg hover:text-primary-400 transition-colors break-words"
                                >
                                  {phone}
                                </a>
                              ))}
                              {allPhones.length > 1 && (
                                <button
                                  onClick={() => togglePhones(school._id)}
                                  className="mt-2 text-sm text-primary-400 hover:underline focus:outline-none"
                                >
                                  {expandedPhones[school._id] ? 'Prikaži manje' : `Prikaži sve (${allPhones.length})`}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                        <div className="flex flex-col">
                          {allEmails.length === 0 ? (
                            <span className="text-sm italic text-gray-500">Nema email adrese</span>
                          ) : (
                            <>
                              {allEmails.slice(0, expandedEmails[school._id] ? allEmails.length : 1).map((email, idx) => (
                                <a 
                                  key={idx} 
                                  href={`mailto:${email}`} 
                                  className="text-base sm:text-lg hover:text-primary-400 transition-colors underline break-words"
                                >
                                  {email}
                                </a>
                              ))}
                              {allEmails.length > 1 && (
                                <button
                                  onClick={() => toggleEmails(school._id)}
                                  className="mt-2 text-sm text-primary-400 hover:underline focus:outline-none"
                                >
                                  {expandedEmails[school._id] ? 'Prikaži manje' : `Prikaži sve (${allEmails.length})`}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

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
                    </div>
                  </motion.div>
                );
              })}
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
