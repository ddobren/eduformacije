import type React from "react"
import { Calendar } from "lucide-react"

interface NewsCardProps {
  title: string
  date: string
  description?: string
  excerpt?: string
  category: string
}

export const NewsCard: React.FC<NewsCardProps> = ({ title, date, description, excerpt, category }) => {
  const content = excerpt || description

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-xs font-medium text-primary-400 bg-primary-400/10 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {date}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 mb-4">{content}</p>
      </div>
    </div>
  )
}

