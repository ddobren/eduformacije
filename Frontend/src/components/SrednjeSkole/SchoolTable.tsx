import React, { useState } from "react";
import Pagination from "../Find/Results/Pagination";

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

export const SchoolTable: React.FC<SchoolTableProps> = ({ schools }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(schools.length / itemsPerPage);
  const paginatedSchools = schools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden shadow">
        <thead className="bg-primary-500 text-white">
          <tr>
            <th className="px-4 py-2">Program</th>
            <th className="px-4 py-2">Škola</th>
            <th className="px-4 py-2">Mjesto</th>
            <th className="px-4 py-2">Županija</th>
            <th className="px-4 py-2">Trajanje</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSchools.map((school, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-700 ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <td className="px-4 py-2">{school.Program}</td>
              <td className="px-4 py-2">{school.Skola}</td>
              <td className="px-4 py-2">{school.Mjesto}</td>
              <td className="px-4 py-2">{school.Zupanija}</td>
              <td className="px-4 py-2">{school.Trajanje}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
