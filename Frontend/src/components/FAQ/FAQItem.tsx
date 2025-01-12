import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={`p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 border border-gray-700/50 ${
        isOpen ? 'mb-6' : 'mb-4'
      }`}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <motion.button
        className="w-full flex justify-between items-center cursor-pointer focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white text-left">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-primary-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-primary-400" />
          )}
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;

