import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { CountySelect } from './CountySelect';
import { CitySelect } from './CitySelect';
import { EntranceExamSelect } from './EntranceExamSelect';
import { GradientButton } from '../common/GradientButton';
import { toast } from '../../utils/toast';

const MAX_CHARS = 200;

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (results: { objasnjenje: string; programi: { skolaProgramRokId: string; program: string }[] } | null) => void;
}

export const SearchForm = ({ onSearchStart, onSearchComplete }: SearchFormProps) => {
  const [interests, setInterests] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [hasEntranceExam, setHasEntranceExam] = useState<boolean | null>(null);

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

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0';

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
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="bg-gray-900/30 backdrop-blur-sm px-3 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 rounded-xl border border-gray-800/50 shadow-xl">
        {/* AI Assistant Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-400 font-medium">AI asistent</span>
        </div>

        {/* Interests Section */}
        <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 lg:gap-2">
            <label className="text-base lg:text-lg font-medium text-white">
              Opiši svoje interese i želje
            </label>
            <span className={`text-xs lg:text-sm ${isNearLimit ? 'text-orange-400' : 'text-gray-400'}`}>
              {charsRemaining} preostalih znakova
            </span>
          </div>
          <div className="relative">
            <textarea
              value={interests}
              onChange={handleInterestsChange}
              autoComplete="off"
              spellCheck={false}
              className="w-full h-32 lg:h-40 px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none 
                text-white placeholder-gray-400 text-sm lg:text-base transition-all outline-none"
              placeholder="Npr: Zanima me fitness i zdrav način života. Volio/la bih postati personalni trener..."
            />
            {isNearLimit && (
              <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 flex items-center gap-1.5 text-orange-400">
                <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            )}
          </div>
          <p className="text-xs lg:text-sm text-gray-400">
            Opiši svoje interese, hobije i što te zanima. Što više detalja pružiš, to ćemo ti bolje pomoći pronaći
            idealnu školu.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mt-8 lg:mt-10">
          <h3 className="text-base lg:text-lg font-medium text-white mb-4 lg:mb-6">Dodatni filtri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
        </div>

        {/* Submit Button */}
        <GradientButton className="w-full md:w-auto md:min-w-[200px] lg:min-w-[240px] mt-8 lg:mt-10 py-2.5 lg:py-3 text-sm lg:text-base mx-auto block">
          <Search className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
          <span className="ml-2">Pronađi škole</span>
        </GradientButton>
      </div>
    </form>
  );
};

