import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-950/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
              onClick={() => setIsOpen(false)}
            >
              <Logo />
              <span className="text-xl font-bold text-white tracking-tight">
                Edu
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  formacije
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {[
              { path: '/', label: 'Početna' },
              { path: '/about', label: 'O nama' },
              { path: '/contact', label: 'Kontakt' },
              { path: '/faq', label: 'FAQ' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group
                  ${isActiveLink(path) 
                    ? 'text-white bg-gray-800/50' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                  }`}
              >
                {label}
                {isActiveLink(path) && (
                  <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-950/95 backdrop-blur-md border-t border-gray-800/50">
          {[
            { path: '/', label: 'Početna' },
            { path: '/about', label: 'O nama' },
            { path: '/contact', label: 'Kontakt' },
            { path: '/faq', label: 'FAQ' },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                ${isActiveLink(path)
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
