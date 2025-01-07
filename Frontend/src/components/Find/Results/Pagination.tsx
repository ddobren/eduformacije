import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages < 1) return null;

  return (
    <motion.div
      className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-full bg-gray-800 text-white hover:bg-primary-500 transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Prethodna stranica"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center font-medium transition-colors transform hover:scale-105 ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-primary-500'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.button>
      ))}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-full bg-gray-800 text-white hover:bg-primary-500 transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Sljedeća stranica"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Pagination;
