import React from "react";
import { LucideIcon } from "lucide-react";

// FeatureCard.tsx
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
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary-500/10 rounded-full p-3">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
