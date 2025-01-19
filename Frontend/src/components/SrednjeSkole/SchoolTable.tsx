import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, FileX } from 'lucide-react';
import Pagination from '../Find/Results/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
interface School {
  Program: string;
  Skola: string;
  Mjesto: string;
  Zupanija: string;
  Trajanje: number;
}

interface SchoolTableProps {
  schools: School[];
}

const EnhancedSchoolTable: React.FC<SchoolTableProps> = ({ schools }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    zupanija: '',
    trajanje: '',
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 10;

  const zupanije = useMemo(() =>
    Array.from(new Set(schools.map(school => school.Zupanija))).sort(),
    [schools]
  );

  const trajanja = useMemo(() =>
    Array.from(new Set(schools.map(school => school.Trajanje))).sort(),
    [schools]
  );

  // Improved search and filter logic
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const searchFields = [
        school.Program.toLowerCase(),
        school.Skola.toLowerCase(),
        school.Mjesto.toLowerCase(),
        school.Zupanija.toLowerCase(),
        school.Trajanje.toString()
      ];

      const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
      const matchesSearch = searchTerms.length === 0 ||
        searchTerms.every(term =>
          searchFields.some(field => field.includes(term))
        );

      const matchesZupanija = filters.zupanija === '' ||
        school.Zupanija === filters.zupanija;

      const matchesTrajanje = filters.trajanje === '' ||
        school.Trajanje === Number(filters.trajanje);

      return matchesSearch && matchesZupanija && matchesTrajanje;
    });
  }, [schools, searchTerm, filters]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setFilters({ zupanija: '', trajanje: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleMobileFilterClose = () => {
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Pretraži po nazivu škole, programu, mjestu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 text-sm outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filters Button */}
        <motion.button
          className="sm:hidden inline-flex items-center px-4 py-2.5 bg-gray-800 text-white rounded-lg border border-gray-700"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filteri
        </motion.button>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <motion.div
              className="sm:hidden fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="fixed inset-y-0 right-0 w-full max-w-xs bg-gray-900 p-6 shadow-xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white">Filteri</h3>
                  <button
                    onClick={handleMobileFilterClose}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Županija</label>
                    <select
                      value={filters.zupanija}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, zupanija: e.target.value }));
                        handleMobileFilterClose();
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sve županije</option>
                      {zupanije.map(zupanija => (
                        <option key={zupanija} value={zupanija}>{zupanija}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Trajanje</label>
                    <select
                      value={filters.trajanje}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, trajanje: e.target.value }));
                        handleMobileFilterClose();
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Sva trajanja</option>
                      {trajanja.map(trajanje => (
                        <option key={trajanje} value={trajanje}>{trajanje} godina</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filters */}
        <div className="hidden sm:flex gap-4">
          <select
            value={filters.zupanija}
            onChange={(e) => setFilters(prev => ({ ...prev, zupanija: e.target.value }))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[180px]"
          >
            <option value="">Sve županije</option>
            {zupanije.map(zupanija => (
              <option key={zupanija} value={zupanija}>{zupanija}</option>
            ))}
          </select>

          <select
            value={filters.trajanje}
            onChange={(e) => setFilters(prev => ({ ...prev, trajanje: e.target.value }))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[140px]"
          >
            <option value="">Sva trajanja</option>
            {trajanja.map(trajanje => (
              <option key={trajanje} value={trajanje}>{trajanje} godina</option>
            ))}
          </select>

          {(filters.zupanija || filters.trajanje || searchTerm) && (
            <motion.button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="h-5 w-5 mr-1" />
              Resetiraj
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Results Info */}
      <motion.div
        className="text-gray-400 text-sm mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Pronađeno {filteredSchools.length} rezultata
      </motion.div>

      {/* No Results State */}
      {filteredSchools.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-12 px-4 bg-gray-800/50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FileX className="h-16 w-16 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nema pronađenih rezultata</h3>
          <p className="text-gray-400 text-center mb-4">
            Pokušajte promijeniti filtere ili pretraživanje
          </p>
          <motion.button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Resetiraj filtere
          </motion.button>
        </motion.div>
      ) : (
        /* Table */
        <motion.div
          className="overflow-x-auto rounded-lg border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <table className="w-full bg-gray-900 text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Program</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Škola</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Mjesto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Županija</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Trajanje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedSchools.map((school, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm">{school.Program}</td>
                  <td className="px-4 py-3 text-sm">{school.Skola}</td>
                  <td className="px-4 py-3 text-sm">{school.Mjesto}</td>
                  <td className="px-4 py-3 text-sm">{school.Zupanija}</td>
                  <td className="px-4 py-3 text-sm">{school.Trajanje}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default EnhancedSchoolTable;
