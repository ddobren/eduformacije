import { useState } from "react"
import { NewsHeader } from "../components/News/NewsHeader"
import { NewsFilter } from "../components/News/NewsFilter"
import { NewsCard } from "../components/News/NewsCard"
import { Navbar } from "../components/common/Navbar"
import { AnimatedBackground } from "../components/common/AnimatedBackground"

const categories = ["Značajke", "Ažuriranja", "Savjeti", "Najave"]

const newsItems = [
    {
        id: 1,
        title: "Poboljšana brzina pretraživanja",
        date: "5. veljače 2025.",
        description: "Implementirali smo nove algoritme koji značajno ubrzavaju proces pretraživanja škola, omogućujući korisnicima brži i efikasniji pristup informacijama o školama u Hrvatskoj.",
        category: "Značajke",
    },
    {
        id: 2,
        title: "Novo: Filtriranje po lokaciji",
        date: "3. veljače 2025.",
        description: "Dodali smo mogućnost filtriranja škola prema lokaciji, čime omogućujemo lakše pronalaženje škola na određenim područjima.",
        category: "Značajke",
    },
    {
        id: 4,
        title: "Kako učinkovito pretraživati",
        date: "1. veljače 2025.",
        description: "Bitno je detaljno opisati svoje hobije, interese i želje kako bi škole odgovarale tvojim potrebama.",
        category: "Savjeti",
    },
]

export const Novosti = () => {
    const [selectedCategory, setSelectedCategory] = useState("sve")

    const sortedNews = [...newsItems].sort((a, b) => b.id - a.id)

    const filteredNews =
        selectedCategory === "sve" ? sortedNews : sortedNews.filter((item) => item.category === selectedCategory)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <Navbar />
            <AnimatedBackground />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <NewsHeader />
                <NewsFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((news) => (
                        <NewsCard key={news.id} {...news} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Novosti

