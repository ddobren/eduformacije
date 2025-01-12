import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, FilterIcon } from 'lucide-react';
import { CountySelect } from './CountySelect';
import { CitySelect } from './CitySelect';
import { EntranceExamSelect } from './EntranceExamSelect';
import { GradientButton } from '../common/GradientButton';
import { toast } from '../../utils/toast';

const MAX_CHARS = 200;

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (results: { 
    objasnjenje: string; 
    programi: { 
      skolaProgramRokId: string; 
      program: string 
    }[] 
  } | null) => void;
}

export const SearchForm = ({ onSearchStart, onSearchComplete }: SearchFormProps) => {
  const [interests, setInterests] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [hasEntranceExam, setHasEntranceExam] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInterestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInterests(text);
    }
  };

  const charsRemaining = MAX_CHARS - interests.length;
  const isNearLimit = charsRemaining <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (interests === '') {
      toast.warning('Molimo unesite svoje interese i želje.');
      return;
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0';

    const params = new URLSearchParams();
    if (selectedCounty) params.append('zupanija', selectedCounty);
    if (selectedCity) params.append('mjesto', selectedCity);
    if (hasEntranceExam !== null) params.append('imaDodatnuProvjeru', String(hasEntranceExam));

    onSearchStart();

    try {
      const endpoint = `https://engine.eduformacije.com/api/v1/srednje-skole?${params.toString()}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Greška prilikom dohvaćanja podataka.');
      }

      const data = await response.json();
      const programs = data && data.length > 0
        ? data.map((item: { Program: string; SkolaProgramRokId: number }) => ({
            skolaProgramRokId: String(item.SkolaProgramRokId),
            program: item.Program,
          }))
        : [];

      const jsonBody = {
        interesi: interests,
        programi: programs,
      };

      const suggestionsResponse = await fetch('https://engine.eduformacije.com/api/v1/srednje-skole/sugestije', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });

      if (!suggestionsResponse.ok) {
        throw new Error('Greška prilikom dohvaćanja sugestija.');
      }

      const suggestions = await suggestionsResponse.json();
      onSearchComplete(suggestions);
      console.log(suggestions);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Došlo je do greške.');
      onSearchComplete(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
          {/* Header Section */}
          <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs font-medium text-primary-400">AI asistent</span>
              </div>
              <span className={`text-xs ${isNearLimit ? 'text-orange-400' : 'text-gray-400'}`}>
                {charsRemaining} znakova
              </span>
            </div>
          </div>

          {/* Main Content */}
            <div className="p-4 sm:p-6 space-y-6">
            {/* Interests Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/90">
              Opiši svoje interese i želje
              </label>
              <div className="relative">
              <textarea
                value={interests}
                onChange={handleInterestsChange}
                autoComplete="off"
                spellCheck={false}
                className="w-full h-28 px-4 py-3 bg-gray-800/40 border border-gray-700/50 rounded-xl
                focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none
                text-white placeholder-gray-500 text-sm transition-all outline-none"
                placeholder="Npr: Zanima me fitness i zdrav način života. Volio/la bih postati personalni trener..."
              />
              {isNearLimit && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-orange-400">
                <AlertCircle className="w-4 h-4" />
                </div>
              )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
              Što više detalja pružiš o svojim interesima i hobijima, to ćemo ti preciznije pomoći pronaći idealnu školu.
              </p>
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
                <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-primary-700"
                >
  <div className="flex items-center gap-2">
    <FilterIcon className="w-4 h-4 text-gray-400" />
    <span className="text-sm font-medium text-white/90">Dodatni filtri</span>
  </div>
                <svg
                className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                </button>
              
              {isExpanded && (
              <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg animate-fadeIn">
                <CountySelect value={selectedCounty} onChange={setSelectedCounty} />
                <CitySelect 
                value={selectedCity} 
                onChange={setSelectedCity} 
                countyId={selectedCounty}
                />
                <EntranceExamSelect 
                value={hasEntranceExam} 
                onChange={setHasEntranceExam}
                />
              </div>
              )}
            </div>
            </div>

          {/* Footer/Submit Section */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-800/30">
            <GradientButton className="w-full py-3 text-sm font-medium">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="ml-2">Pronađi škole</span>
            </GradientButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
