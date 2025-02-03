import type React from "react"
import { NewsCard } from "./NewsCard"

interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  imageUrl: string
  category: string
}

interface NewsListProps {
  news: NewsItem[]
}

export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <NewsCard key={item.id} {...item} />
      ))}
    </div>
  )
}

