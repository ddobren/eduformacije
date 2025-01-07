import React from 'react';

interface NormalButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NormalButton: React.FC<NormalButtonProps> = ({ children, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
};
