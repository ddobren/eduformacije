// src/pages/Search.tsx

import React, { useEffect, useState } from 'react';
import { SearchForm } from '../components/Search/SearchForm';
import LoadingState from '../components/Search/LoadingState';
import { Results } from '../components/Search/Results/Result'; // Ispravljen uvoz
import { School } from '../types/search';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const Search: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
    }, []);

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<School[] | null>(null);

    const handleSearchStart = () => {
        setIsSearching(true);
    };

    const handleSearchComplete = (results: School[] | null) => {
        setIsSearching(false);
        setSearchResults(results);
    };

    const handleReset = () => {
        setSearchResults(null);
    };

    return (
        <>
            <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
                <Navbar />
                <div className="relative min-h-screen pt-20">
                    <AnimatedBackground />
                    <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                        {!isSearching && !searchResults && (
                            <SearchForm
                                onSearchStart={handleSearchStart}
                                onSearchComplete={handleSearchComplete}
                            />
                        )}

                        {isSearching && <LoadingState />}

                        {searchResults && !isSearching && (
                            <Results
                                schools={searchResults}
                                onReset={handleReset}
                            />
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Search;
