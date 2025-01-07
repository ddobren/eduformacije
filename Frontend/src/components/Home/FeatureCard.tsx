import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => {
  return (
    <div className="group h-full">
      <div className="relative h-full bg-gray-900/30 backdrop-blur-sm border border-gray-800 p-8 rounded-xl transition-all duration-500 ease-in-out">
        <div className="w-14 h-14 mb-6 mx-auto">
          <div className="w-full h-full bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-500/20 transition-all duration-500">
            <Icon className="text-primary-400 w-6 h-6" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-white group-hover:text-primary-400 transition-colors duration-500">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
        <div className="absolute inset-0 rounded-xl bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};
