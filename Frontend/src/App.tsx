import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Find } from './pages/Find';
import { Contact } from './pages/Contact';
import { ToastContainer } from './components/common/ToastContainer';
import { NotFound } from './pages/NotFound';
import { Search } from './pages/Search';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import { SrednjeSkole } from './pages/SrednjeSkole';
import Novosti from './pages/Novosti';
import BetaSignupPage from './components/BetaSignup/BetaSignup';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Funkcija koja će se pozvati kada se stranica u potpunosti učita
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Provjeri je li stranica već učitana
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Očisti event listener
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div>
      <ToastContainer />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<Novosti />} />
            <Route path="/find" element={<Find />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/beta-signup" element={<BetaSignupPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/srednje-skole" element={<SrednjeSkole />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
