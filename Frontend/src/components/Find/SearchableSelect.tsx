import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MapPin, X } from "lucide-react"

interface SearchableSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  onClear?: () => void
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  onClear,
}) => {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-900/50 border border-gray-800 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white 
            placeholder-gray-400 transition-all outline-none"
        />
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && search && (
        <div
          className="absolute left-0 right-0 mt-1.5 bg-gray-900/95 backdrop-blur-sm border 
          border-gray-800 rounded-lg shadow-xl z-50 max-h-48 sm:max-h-52 overflow-y-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setSearch("")
                  setIsOpen(false)
                  inputRef.current?.blur()
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-left text-white hover:bg-gray-800/50 
                  focus:bg-gray-800/50 focus:outline-none transition-colors"
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-400">Nema rezultata</div>
          )}
        </div>
      )}

      {value && (
        <div className="mt-2 inline-flex items-center gap-1.5">
          <div
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-500/10 text-primary-400 rounded-md 
            inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate">{value}</span>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className="p-1 hover:bg-gray-800/50 rounded-full transition-colors group"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

