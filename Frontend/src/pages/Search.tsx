import type React from "react"
import { useEffect, useState } from "react"
import { SearchForm } from "../components/Search/SearchForm"
import LoadingState from "../components/Search/LoadingState"
import { Results } from "../components/Search/Results/Result"
import type { School } from "../types/search"
import { Navbar } from "../components/common/Navbar"
import { Footer } from "../components/common/Footer"
import { AnimatedBackground } from "../components/common/AnimatedBackground"
import { motion, AnimatePresence } from "framer-motion"
import Pagination from "../components/Find/Results/Pagination"

const ITEMS_PER_PAGE = 10

export const Search: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [allSearchResults, setAllSearchResults] = useState<School[] | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleSearchStart = () => {
    setIsSearching(true)
    setCurrentPage(1)
  }

  const handleSearchComplete = (results: School[] | null) => {
    setIsSearching(false)
    setAllSearchResults(results)
  }

  const handleReset = () => {
    setAllSearchResults(null)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const paginatedResults = allSearchResults
    ? allSearchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : null

  const totalPages = allSearchResults ? Math.ceil(allSearchResults.length / ITEMS_PER_PAGE) : 0

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      <Navbar />
      <main className="relative min-h-[calc(100vh-64px)] pt-24 sm:pt-32 pb-12">
        <AnimatedBackground />
        <div className="relative mx-auto">
          <AnimatePresence mode="wait">
            {!isSearching && !allSearchResults && (
              <motion.div
                key="search-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <SearchForm onSearchStart={handleSearchStart} onSearchComplete={handleSearchComplete} />
              </motion.div>
            )}

            {isSearching && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 sm:px-6 lg:px-8"
              >
                <LoadingState />
              </motion.div>
            )}

            {allSearchResults && !isSearching && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="px-4 sm:px-6 lg:px-8"
              >
                <Results schools={paginatedResults || []} onReset={handleReset} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Search
