import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Building2, X } from "lucide-react"

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  onClear?: () => void
}

export const SelectInput: React.FC<SelectProps> = ({ label, value, onChange, options, placeholder, onClear }) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-sm sm:text-base bg-gray-900/50 border border-gray-800 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white 
            placeholder-gray-400 transition-all outline-none flex items-center justify-between"
        >
          <span className={value ? "text-white" : "text-gray-400"}>{value || placeholder}</span>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <ChevronDown
              className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute left-0 right-0 mt-1.5 bg-gray-900/95 backdrop-blur-sm border 
            border-gray-800 rounded-lg shadow-xl z-50 max-h-48 sm:max-h-52 overflow-y-auto"
          >
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-left text-white hover:bg-gray-800/50 
                    focus:bg-gray-800/50 focus:outline-none transition-colors"
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-400">Nema opcija</div>
            )}
          </div>
        )}
      </div>

      {value && (
        <div className="mt-2 inline-flex items-center gap-1.5">
          <div
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-500/10 text-primary-400 rounded-md 
            inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

export default SelectInput

