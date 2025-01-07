import React, { useEffect, useState } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { fetchCities } from '../../api/cities';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  countyId: string;
}

const CACHE_KEY = 'cachedCities';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 sata u milisekundama

export const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);

          // Provjera valjanosti keša
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCities(data);
            setLoading(false);
            return;
          }
        }

        // Ako nema keša ili je istekao, povuci nove podatke
        const fetchedCities = await fetchCities();
        setCities(fetchedCities);

        // Spremi nove podatke u keš
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: fetchedCities, timestamp: Date.now() })
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

    loadCities();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Učitavanje mjesta...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <SearchableSelect
      label="Mjesto"
      value={value}
      onChange={onChange}
      options={cities}
      placeholder="Pretraži mjesta..."
    />
  );
};
