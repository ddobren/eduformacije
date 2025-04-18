import React, { useEffect, useState } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { fetchCities as fetchCounties } from '../../api/counties';

interface CountySelectProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const CACHE_KEY = 'cachedCounties';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 sata u milisekundama

export const CountySelect: React.FC<CountySelectProps> = ({ value, onChange, onClear }) => {
  const [counties, setCounties] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCounties = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);

          if (Date.now() - timestamp < CACHE_DURATION) {
            setCounties(data);
            setLoading(false);
            return;
          }
        }

        const fetchedCounties = await fetchCounties();
        setCounties(fetchedCounties);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fetchedCounties, timestamp: Date.now() })
        );

        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    loadCounties();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Učitavanje županija...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <SearchableSelect
      label="Županija"
      value={value}
      onChange={onChange}
      onClear={onClear}
      options={counties}
      placeholder="Pretraži županije..."
    />
  );
};
