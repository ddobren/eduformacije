import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FeaturedNewsProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const FeaturedNews: React.FC<FeaturedNewsProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-500/10 to-primary-700/10 backdrop-blur-lg border border-gray-700/50"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 lg:p-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-400/10 text-primary-400 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Izdvojeno
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300 text-lg mb-6">{description}</p>
          <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
            Saznaj više
          </button>
        </div>
        <div className="relative h-64 lg:h-auto">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent lg:bg-gradient-to-l" />
        </div>
      </div>
    </motion.div>
  );
};
