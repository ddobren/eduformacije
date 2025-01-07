// src/components/Find/Results/useSchoolData.ts
import { useState, useEffect } from 'react';
import { Program, SchoolDetails, GroupedProgram } from '../../../types/school';

export const useSchoolData = (programs: Program[]) => {
  const [loading, setLoading] = useState(true);
  const [groupedPrograms, setGroupedPrograms] = useState<GroupedProgram[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(groupedPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = groupedPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0'; // Koristite environment varijablu

        if (!token) {
          throw new Error('API token nije postavljen.');
        }

        const response = await fetch('https://engine.eduformacije.com/api/v1/srednje-skole', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Greška prilikom dohvaćanja podataka o školama.');
        }

        const allSchools: SchoolDetails[] = await response.json();
        const skolaProgramRokIds = programs.map((program) => program.skolaProgramRokId);

        const filteredSchools = skolaProgramRokIds
          .map((id) => allSchools.find((school) => String(school.SkolaProgramRokId) === id))
          .filter((school): school is SchoolDetails => school !== undefined);

        // Grupiranje po nazivu programa
        const grouped = filteredSchools.reduce<GroupedProgram[]>((acc, school) => {
          const existingGroup = acc.find((g) => g.programName === school.Program);
          if (existingGroup) {
            existingGroup.schools.push(school);
          } else {
            acc.push({ programName: school.Program, schools: [school] });
          }
          return acc;
        }, []);

        setGroupedPrograms(grouped);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Došlo je do greške');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [programs]);

  return {
    loading,
    error,
    groupedPrograms: paginatedPrograms,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
