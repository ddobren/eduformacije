import type React from "react"
import { Filter } from "lucide-react"

interface NewsFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export const NewsFilter: React.FC<NewsFilterProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center text-gray-400">
        <Filter className="w-5 h-5 mr-2" />
        <span>Filtriraj po:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("sve")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "sve"
              ? "bg-primary-500 text-white"
              : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
          }`}
        >
          Sve
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary-500 text-white"
                : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

