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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuliraj učitavanje sadržaja (npr. 2 sekunde)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Očisti timer
  }, []);

  return (
    <div>
      <ToastContainer />

      {isLoading ? (
        <LoadingScreen /> // Prikaži loader
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find" element={<Find />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* 404 stranica */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
