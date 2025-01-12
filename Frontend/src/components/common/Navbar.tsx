'use client'

import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isActiveLink = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Početna' },
    { path: '/about', label: 'O nama' },
    { path: '/contact', label: 'Kontakt' },
    { path: '/faq', label: 'FAQ' },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
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
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  formacije
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group hover:scale-105
                  ${
                    isActiveLink(path)
                      ? 'text-white bg-gray-800/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                  }`}
              >
                {label}
                {isActiveLink(path) && (
                  <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full" />
                )}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 hover:scale-110"
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
        className={`md:hidden fixed inset-0 bg-gray-950/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`w-full max-w-sm px-6 py-4 rounded-xl text-center text-lg font-medium transition-all duration-300 transform hover:scale-105
                ${
                  isActiveLink(path)
                    ? 'text-white bg-gray-800/50 shadow-lg shadow-primary-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
            >
              {label}
              {isActiveLink(path) && (
                <span className="block w-8 h-0.5 mx-auto mt-2 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

