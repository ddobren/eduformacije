import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SchoolCard from './SchoolCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SchoolDetails } from '../../../types/school';

interface ProgramCardProps {
  programName: string;
  schools: SchoolDetails[];
}

const ProgramCard: React.FC<ProgramCardProps> = ({ programName, schools }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800/50 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="p-3 sm:p-4 md:p-6 flex justify-between items-center cursor-pointer hover:bg-gray-900/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white pr-2">
          {programName}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
        )}
      </div>

      <p className="px-3 sm:px-4 md:px-6 pb-2 sm:pb-3 text-sm sm:text-base text-gray-400">
        Dostupno u {schools.length} {schools.length === 1 ? 'školi' : 'škole'}
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {schools.map((school, index) => (
              <SchoolCard key={school.SkolaProgramRokId} school={school} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProgramCard;

