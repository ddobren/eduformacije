import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

interface NavLinkProps {
  path: string;
  label: string;
  highlight?: boolean;
}

const NavLink = ({ path, label, highlight }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  if (highlight) {
    return (
      <Link
        to={path}
        className={`  
          relative px-4 py-2 text-sm font-semibold
          flex items-center
          group
          transition-all duration-300 ease-in-out
          text-transparent
          bg-clip-text
          bg-gradient-to-r 
          from-gray-500 via-gray-300 to-gray-500
          bg-[length:200%_auto]
          animate-gradient-text
          hover:from-gray-600 hover:via-gray-400 hover:to-gray-600
        `}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={path}
      className={`
        relative px-4 py-2 text-sm font-medium
        transition-all duration-300 ease-in-out
        flex items-center
        ${isActive ? "text-primary-500" : "text-gray-300 hover:text-white"}
      `}
    >
      {label}
      <span
        className={`
        absolute bottom-0 left-0 w-full h-0.5
        transform origin-left scale-x-0 transition-transform duration-300
        bg-gradient-to-r from-primary-400 to-primary-600
        ${isActive ? "scale-x-100" : "group-hover:scale-x-100"}
      `}
      />
    </Link>
  );
};

const MobileMenu = ({
  isOpen,
  navLinks,
  onClose,
}: {
  isOpen: boolean;
  navLinks: NavLinkProps[];
  onClose: () => void;
}) => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`
        fixed inset-0 z-50 
        transition-all duration-300 ease-in-out
        pointer-events-none
        lg:hidden
      `}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/95
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Menu content */}
      <div
        ref={menuRef}
        className={`
          absolute inset-0 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full"}
        `}
      >
        <div className="p-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={onClose}
          >
            <Logo />
            <span className="text-2xl font-bold">
              <span className="text-white">Edu</span>
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                formacije
              </span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  block py-3 px-4 text-lg font-medium
                  transition-all duration-300 ease-in-out
                  ${
                    link.highlight
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 bg-[length:200%_auto] animate-gradient-text"
                      : location.pathname === link.path
                      ? "text-primary-400"
                      : "text-gray-300 hover:text-white"
                  }
                `}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      prevScrollY.current = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${prevScrollY.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, prevScrollY.current);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks: NavLinkProps[] = [
    { path: "/", label: "Početna" },
    { path: "/news", label: "Novosti" },
    { path: "/about", label: "O nama" },
    { path: "/contact", label: "Kontakt" },
    { path: "/faq", label: "FAQ" },
    { path: "/srednje-skole", label: "Srednje škole", highlight: true },
  ];

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-40
      transition-all duration-300 ease-in-out
      ${
        scrolled
          ? "bg-black/95 backdrop-blur-md py-2 shadow-lg shadow-black/10"
          : "bg-transparent py-4"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Logo />
            <span className="text-2xl font-bold">
              <span className="text-white">Edu</span>
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                formacije
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.path} {...link} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`
              lg:hidden z-50 p-2
              text-gray-100 hover:text-primary-400
              transition-colors duration-300
              focus:outline-none
            `}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <Menu className={`w-8 h-8 ${isOpen ? "hidden" : "block"}`} />
          </button>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isOpen}
            navLinks={navLinks}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
};
