import React, { useEffect, useState } from 'react';
import { fetchFounderTypes } from '../../api/founderTypes';
import { SelectInput } from './SelectInput';

interface FounderTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const CACHE_KEY = 'cachedFounderTypes';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const FounderTypeSelect: React.FC<FounderTypeSelectProps> = ({ value, onChange, onClear }) => {
  const [founderTypes, setFounderTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFounderTypes = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setFounderTypes(data);
            setLoading(false);
            return;
          }
        }

        const fetchedFounderTypes = await fetchFounderTypes();
        setFounderTypes(fetchedFounderTypes);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fetchedFounderTypes, timestamp: Date.now() })
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

    loadFounderTypes();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Učitavanje vrsta osnivača...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <SelectInput
      label="Vrsta osnivača"
      value={value}
      onChange={onChange}
      options={founderTypes}
      placeholder="Odaberite vrstu osnivača"
      onClear={onClear}
    />
  );
};
