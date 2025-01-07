import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 text-base bg-gray-900/50 border border-gray-800 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white 
            placeholder-gray-400 transition-all outline-none"
        />
        <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && search && (
        <div className="absolute left-0 right-0 mt-1.5 bg-gray-900/95 backdrop-blur-sm border 
          border-gray-800 rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setSearch('');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-base text-left text-white hover:bg-gray-800/50 
                  focus:bg-gray-800/50 focus:outline-none transition-colors"
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-4 py-2.5 text-base text-gray-400">Nema rezultata</div>
          )}
        </div>
      )}

      {value && (
        <div className="mt-2 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-md 
          inline-flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
};
