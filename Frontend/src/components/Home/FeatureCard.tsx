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
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-primary-500/50 transition-all duration-300 h-full overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="bg-primary-500/10 rounded-xl p-4 group-hover:bg-primary-500/20 transition-colors duration-300">
          <Icon className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
        </div>
        
        <h3 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
