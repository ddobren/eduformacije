import { useEffect, useState } from "react";
import { Navbar } from "../components/common/Navbar";
import { SearchForm } from "../components/Find/SearchForm";
import { LoadingState } from "../components/Find/LoadingState";
import { Results } from "../components/Find/Results/Results";
import { Footer } from "../components/common/Footer";
import { AnimatedBackground } from "../components/common/AnimatedBackground";

type ViewState = 'form' | 'loading' | 'results';

export const Find = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Skrolaj na vrh (x: 0, y: 0)
    }, []);

    const [viewState, setViewState] = useState<ViewState>('form');
    const [results, setResults] = useState<{ objasnjenje: string; programi: { skolaProgramRokId: string; program: string }[] } | null>(null);

    const handleSearchStart = () => {
        setViewState('loading');

        // scrolaj na vrh stranice
        window.scrollTo({ top: 0, behavior: 'smooth' });

    };

    const handleSearchComplete = (data: { objasnjenje: string; programi: { skolaProgramRokId: string; program: string }[] } | null) => {
        setResults(data);
        setViewState('results');
    };

    const handleReset = () => {
        setViewState('form');
        setResults(null);
    };

    const renderContent = () => {
        switch (viewState) {
            case 'loading':
                return <LoadingState />;
            case 'results':
                return results ? (
                    <Results explanation={results.objasnjenje} programs={results.programi} onReset={handleReset} />
                ) : (
                    <div className="text-center text-gray-400">Nema dostupnih rezultata.</div>
                );
            default:
                return <SearchForm onSearchStart={handleSearchStart} onSearchComplete={handleSearchComplete} />;
        }
    };

    return (
        <>
            <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
                <Navbar />
                <div className="relative min-h-screen pt-20">
                    <AnimatedBackground />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {renderContent()}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Find;
