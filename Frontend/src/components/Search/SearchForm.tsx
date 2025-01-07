// src/components/Search/SearchForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { GradientButton } from '../common/GradientButton';
import { toast } from '../../utils/toast';
import { School } from '../../types/search';
import Fuse from 'fuse.js';
import LoadingState from './LoadingState';

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (results: School[] | null) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearchStart, onSearchComplete }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<School[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const fuse = useRef<Fuse<School> | null>(null);

  useEffect(() => {
    const fetchAllSchools = async () => {
      setIsLoading(true);
      try {
        const cachedData = localStorage.getItem('allSchools');
        if (cachedData) {
          const parsedData: School[] = JSON.parse(cachedData);
          setAllSchools(parsedData);
          fuse.current = new Fuse(parsedData, {
            keys: ['Naziv', 'Mjesto'],
            threshold: 0.3,
          });
          setIsLoading(false);
          return;
        }

        const token = 'YOUR_TOKEN';

        const responseMiddle = await fetch('https://engine.eduformacije.com/api/v1/skole/srednje', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseMiddle.ok) {
          throw new Error('Greška prilikom dohvaćanja srednjih škola');
        }

        const srednjeSkole: School[] = await responseMiddle.json();

        const responseElementary = await fetch('https://engine.eduformacije.com/api/v1/skole/osnovne', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseElementary.ok) {
          throw new Error('Greška prilikom dohvaćanja osnovnih škola');
        }

        const osnovneSkole: School[] = await responseElementary.json();

        const combinedSchools = [...srednjeSkole, ...osnovneSkole];
        setAllSchools(combinedSchools);
        localStorage.setItem('allSchools', JSON.stringify(combinedSchools));
        fuse.current = new Fuse(combinedSchools, {
          keys: ['Naziv', 'Mjesto'],
          threshold: 0.3,
        });
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast.error('Došlo je do greške prilikom učitavanja škola');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSchools();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      toast.warning('Molimo unesite naziv škole za pretraživanje');
      return;
    }

    onSearchStart();

    try {
      let filteredResults: School[] = [];

      if (selectedSchoolId) {
        const selectedSchool = allSchools.find(school => school._id === selectedSchoolId);
        if (selectedSchool) {
          filteredResults = [selectedSchool];
        }
      } else if (fuse.current) {
        const fuseResults = fuse.current.search(searchTerm, { limit: 50 });
        filteredResults = fuseResults.map(result => result.item);
      } else {
        filteredResults = allSchools.filter((school: School) =>
          school.Naziv.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      onSearchComplete(filteredResults.length > 0 ? filteredResults : null);

      if (filteredResults.length === 0 && selectedSchoolId === null) {
        toast.error('Nema rezultata za pretragu');
      }

      setShowSuggestions(false);
    } catch (error) {
      console.error('Pretraga nije uspela:', error);
      toast.error('Došlo je do greške prilikom pretraživanja');
      onSearchComplete(null);
    }
  };

  const fetchSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const exactMatches = allSchools.filter((school: School) =>
      school.Naziv.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 10);

    setSuggestions(exactMatches);
  };

  const highlightMatch = (text: string, query: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} className="text-primary-400 font-semibold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    setSelectedSchoolId(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: School) => {
    setSearchTerm(suggestion.Naziv);
    setSelectedSchoolId(suggestion._id);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const wrapperRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSearch} className="w-full max-w-5xl mx-auto" ref={wrapperRef}>
      <div className="bg-gray-900/30 backdrop-blur-sm px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 rounded-xl border border-gray-800/50 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
          <Search className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-400 font-medium">Pretraživanje škola</span>
        </div>

        <div className="mt-6 space-y-4">
          <label className="text-base lg:text-lg font-medium text-white" htmlFor="school-search">
            Pretraži škole
          </label>
          <div className="relative">
            <input
              id="school-search"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 text-base transition-all outline-none"
              placeholder="Unesite naziv škole..."
              autoComplete="off"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="text-white">
                      {highlightMatch(suggestion.Naziv, searchTerm)}
                    </span>
                    <span className="text-gray-400 text-sm">{suggestion.Mjesto}</span>
                  </li>
                ))}
              </ul>
            )}
            {showSuggestions && isLoading && (
              <LoadingState />
            )}
          </div>
        </div>

        <GradientButton className="w-full md:w-auto md:min-w-[200px] lg:min-w-[240px] mt-8 py-3 text-base mx-auto block flex items-center justify-center">
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="ml-2">Pretraži škole</span>
        </GradientButton>
      </div>
    </form>
  );
};
