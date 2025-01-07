import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ children, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg ${className}`}
    >
      {/* Slojevi za gradient i pozadinu */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg opacity-50 group-hover:opacity-100 blur-sm transition-opacity" />
      <div className="absolute inset-0 bg-gray-900 rounded-lg" />
      {/* Sadržaj dugmeta */}
      <div className="relative flex items-center justify-center gap-2 text-white group-hover:text-gray-300 transition-colors">
        {children}
      </div>
    </button>
  );
};
