import React from 'react';

interface EntranceExamSelectProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export const EntranceExamSelect: React.FC<EntranceExamSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-medium text-gray-300">
        Prijemni ispit
      </label>
      <div className="flex items-center gap-2.5">
        {[
          { label: 'Da', value: true },
          { label: 'Ne', value: false },
          { label: 'Svejedno', value: null },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              value === option.value
                ? 'bg-primary-500/10 text-primary-500 border-primary-500/20 shadow-sm'
                : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
            } focus:outline-none focus:ring-2 focus:ring-primary-500/50`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
