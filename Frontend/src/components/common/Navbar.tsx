import React from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Link to="/" className='flex items-center gap-2'>
              <Logo />
              <span className="text-xl font-bold text-white">
                Edu<span className="text-primary-400">formacije</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Početna</Link>
              <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">O nama</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Kontakt</Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Početna</Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">O nama</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Kontakt</Link>
          </div>
        </div>
      )}
    </nav>
  );
};
