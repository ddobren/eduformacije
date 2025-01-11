import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`p-4 bg-gray-800 rounded-lg shadow-lg transition-all ${
        isOpen ? 'mb-4' : 'mb-2'
      } hover:scale-[1.02]`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center cursor-pointer">
        <h3 className="text-base sm:text-lg font-medium text-white">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-primary-400 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-6 h-6 text-primary-400 transition-transform duration-300" />
        )}
      </div>
      {isOpen && (
        <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed transition-opacity duration-300">
          {answer}
        </p>
      )}
    </div>
  );
};

export default FAQItem;
