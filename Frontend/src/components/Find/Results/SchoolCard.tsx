import React, { useState } from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import getValidUrl from '../../../utils/urlUtils';
import { motion } from 'framer-motion';
import { SchoolDetails } from '../../../types/school';

interface SchoolCardProps {
  school: SchoolDetails;
  index: number;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, index }) => {

  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showAllPhones, setShowAllPhones] = useState(false);

  const allEmails = school.EMail
    ? school.EMail.split(/[,;]+/).map((e) => e.trim()).filter(Boolean)
    : [];

  const allPhones = school.BrojTelefona
    ? school.BrojTelefona.split(/[,;]+/).map((p) => p.trim()).filter(Boolean)
    : [];

  const validLink = getValidUrl(school.Web);

  return (
    <motion.div
      className="bg-gray-800/60 rounded-lg p-2.5 sm:p-3 md:p-4 space-y-3 sm:space-y-4 border border-gray-700/50 hover:border-primary-500 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white">
          {school.Skola}
        </h4>
        <span className="text-xs text-gray-500 italic flex-shrink-0">#{index + 1}</span>
      </div>

      <div className="text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1">
        <p>
          <strong>Adresa:</strong> {school.Adresa || 'N/A'}
        </p>
        <p>
          <strong>Lokacija:</strong> {school.Mjesto}, {school.Zupanija}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
        <div className="flex items-start gap-2 break-all">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 mt-0.5" />
          <div className="flex flex-col">
            {allPhones.length === 0 ? (
              <span className="text-xs sm:text-sm italic text-gray-500">Nema broja telefona</span>
            ) : (
              <>
                {allPhones.slice(0, showAllPhones ? allPhones.length : 1).map((phone, idx) => (
                  <span key={idx} className="text-sm sm:text-base hover:text-primary-400 transition-colors">
                    {phone}
                  </span>
                ))}
                {allPhones.length > 1 && (
                  <button
                    onClick={() => setShowAllPhones(!showAllPhones)}
                    className="mt-1 text-xs sm:text-sm text-primary-400 hover:underline focus:outline-none"
                  >
                    {showAllPhones ? 'Prikaži manje' : `Prikaži sve (${allPhones.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {validLink ? (
          <div className="flex items-center gap-2 break-all">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
            <a
              href={validLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-primary-400 hover:text-primary-300 transition-colors underline"
            >
              Službena web stranica
            </a>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-xs sm:text-sm italic text-gray-500">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            Nema web adrese
          </p>
        )}

        <div className="flex items-start gap-2 break-all sm:col-span-2">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 mt-0.5" />
          <div className="flex flex-col">
            {allEmails.length === 0 ? (
              <span className="text-xs sm:text-sm italic text-gray-500">Nema email adrese</span>
            ) : (
              <>
                {allEmails.slice(0, showAllEmails ? allEmails.length : 1).map((email, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base hover:text-primary-400 transition-colors underline"
                  >
                    {email}
                  </p>
                ))}
                {allEmails.length > 1 && (
                  <button
                    onClick={() => setShowAllEmails(!showAllEmails)}
                    className="mt-1 text-xs sm:text-sm text-primary-400 hover:underline focus:outline-none"
                  >
                    {showAllEmails ? 'Prikaži manje' : `Prikaži sve (${allEmails.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SchoolCard;

