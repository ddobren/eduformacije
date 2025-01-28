import React, { useEffect, useState } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { fetchCities } from '../../api/cities';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  countyId: string;
}

interface CacheData {
  data: string[];
  timestamp: number;
}

const CACHE_KEY = 'cachedCities';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 sata u milisekundama

export const CitySelect: React.FC<CitySelectProps> = ({ 
  value, 
  onChange, 
  onClear, 
}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        
        if (cachedData) {
          const { data, timestamp }: CacheData = JSON.parse(cachedData);
          
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCities(data);
            setLoading(false);
            return;
          }
        }

        const fetchedCities = await fetchCities();
        setCities(fetchedCities);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ 
            data: fetchedCities, 
            timestamp: Date.now() 
          })
        );

        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []); // Load cities only once on component mount

  // Filter cities by countyId if needed
  const filteredCities = React.useMemo(() => {
    // If you need to filter by countyId, implement the logic here
    // For now, return all cities since they're coming pre-filtered from the API
    return cities;
  }, [cities]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <p className="text-gray-300">Učitavanje mjesta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-700">Greška pri učitavanju: {error}</p>
      </div>
    );
  }

  return (
    <SearchableSelect
      label="Mjesto"
      value={value}
      onChange={onChange}
      onClear={onClear}
      options={filteredCities}
      placeholder="Pretraži mjesta..."
    />
  );
};
