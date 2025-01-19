import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Logo } from "./Logo"

interface NavLinkProps {
  path: string
  label: string
}

const NavLink = ({ path, label }: NavLinkProps) => {
  const location = useLocation()
  const isActive = location.pathname === path
  const isSrednje = path === "/srednje-skole"

  return (
    <Link
      to={path}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-200 group
                  ${isActive ? "text-white bg-gray-800/60" : "text-gray-300 hover:text-white hover:bg-gray-800/40"}
                  ${isSrednje ? "overflow-hidden" : ""}
      `}
    >
      {label}

      <span
        className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full 
                    bg-gradient-to-r from-primary-400 to-primary-600 
                    transition-all duration-300 ease-out 
          ${isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"}
        `}
      />

      {isSrednje && (
        <span
          className="pointer-events-none absolute inset-0 
                     rounded-lg border-4 border-primary-500 
                     group-hover:border-transparent 
                     transition-all duration-300"
        />
      )}
    </Link>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  navLinks: Array<NavLinkProps>
  toggleMenu: () => void
}

const MobileMenu = ({ isOpen, navLinks, toggleMenu }: MobileMenuProps) => {
  const location = useLocation()

  return (
    <div
      className={`fixed inset-0 z-0 bg-gray-950/98 backdrop-blur-md lg:hidden transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center min-h-screen space-y-4 p-4 
                    transform transition-all duration-300 ease-out 
                    ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
      >
        {navLinks.map(({ path, label }, index) => (
          <Link
            key={path}
            to={path}
            onClick={toggleMenu}
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`relative w-full max-w-xs px-4 py-3 text-center text-base font-medium 
                        rounded-lg transition-all duration-200 transform 
                        hover:scale-105 
                        ${
                          location.pathname === path
                            ? "text-white bg-gray-800/60 shadow-md shadow-primary-500/10"
                            : "text-gray-300 hover:text-white hover:bg-gray-800/40"
                        }
                        ${path === "/srednje-skole" ? "overflow-hidden" : ""}
            `}
          >
            {label}

            {location.pathname === path && (
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
            )}

            {path === "/srednje-skole" && (
              <span
                className="pointer-events-none absolute inset-0 
                           rounded-lg border-4 border-primary-500 
                           group-hover:border-transparent 
                           transition-all duration-300"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    document.body.style.overflow = ""
  }, [location.pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    document.body.style.overflow = !isOpen ? "hidden" : ""
  }

  const navLinks = [
    { path: "/", label: "Početna" },
    { path: "/about", label: "O nama" },
    { path: "/contact", label: "Kontakt" },
    { path: "/faq", label: "FAQ" },
    { path: "/srednje-skole", label: "Srednje škole" },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-950/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <Logo />
            <span className="text-xl font-bold text-white tracking-tight">
              Edu
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                formacije
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} {...link} />
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className={`lg:hidden relative z-10 p-2 rounded-lg text-gray-300 hover:text-white 
                        transition-all duration-200 hover:bg-gray-800/40 
                        focus:outline-none focus:ring-2 focus:ring-primary-400/50 
                        ${isOpen ? "text-white" : ""}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            {isOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-90 hover:rotate-180" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
            )}
          </button>

          <MobileMenu isOpen={isOpen} navLinks={navLinks} toggleMenu={toggleMenu} />
        </div>
      </div>
    </nav>
  )
}

