import { School } from 'lucide-react';
//import LoadingState from '../LoadingState';
import { useSchoolData } from './useSchoolData';
import ProgramCard from './ProgramCard';
import Pagination from './Pagination';
import { Program } from '../../../types/school';
import { motion } from 'framer-motion';
import { GradientButton } from '../../common/GradientButton';
import FetchLoading from './FetchLoading';

interface ResultsProps {
  explanation: string;
  programs: Program[];
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ explanation, programs, onReset }) => {
  const {
    loading,
    error,
    groupedPrograms,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useSchoolData(programs);

  if (loading) return <FetchLoading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-orange-400 p-4 sm:p-8 space-y-4">
        <p className="text-base sm:text-lg">{error}</p>
        <GradientButton onClick={onReset} className="mt-4">
          Pokušaj ponovno
        </GradientButton>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-sm p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl border border-gray-800/50 shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <School className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Preporučeni programi
            </h2>
          </div>
          <GradientButton onClick={onReset} className="w-full sm:w-auto">
            Nova pretraga
          </GradientButton>
        </div>

        <motion.div
          className="bg-gray-800/60 text-white p-3 sm:p-4 md:p-6 rounded-lg mb-4 sm:mb-6 md:mb-8 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">{explanation}</p>
        </motion.div>

        {groupedPrograms.length > 0 ? (
          <>
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {groupedPrograms.map((group) => (
                <ProgramCard
                  key={group.programName}
                  programName={group.programName}
                  schools={group.schools}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 sm:mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 text-base sm:text-lg md:text-xl">
            Nema dostupnih podataka o školama.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Results;

