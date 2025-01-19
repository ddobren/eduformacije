import React from "react";
import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  Icon,
  title,
  description,
}) => {
  return (
    <motion.div 
      className="bg-gray-900 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl h-full"
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary-500/10 rounded-full p-4">
          <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-white">{title}</h3>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

