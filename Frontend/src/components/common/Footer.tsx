import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-bold text-white">
                Edu<span className="text-primary-400">formacije</span>
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Linkovi</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  O nama
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Resursi</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privatnost
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Pratite nas</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/ddobren" className="hover:text-white transition-colors hover:scale-110">
                <Github size={20} />
              </a>
              <a href="https://chat.whatsapp.com/H9Gqn0TWWlt0zWMbA1mSfV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-110">
                <MessageCircle size={20} />
              </a>
              <a href="https://hr.linkedin.com/in/dobren-dragojevi%C4%87-0097b7333" className="hover:text-white transition-colors hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a href="mailto:dragojevicdobren@gmail.com" className="hover:text-white transition-colors hover:scale-110">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-16 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Eduformacije. Sva prava pridržana.</p>
          <p className="text-gray-500 mt-2">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
};
