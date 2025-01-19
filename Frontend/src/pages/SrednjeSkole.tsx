import React, { useEffect, useState } from "react";
import { Navbar } from "../components/common/Navbar";
import { AnimatedBackground } from "../components/common/AnimatedBackground";
import { Footer } from "../components/common/Footer";
import LoadingSchools from "../components/SrednjeSkole/LoadingSchools";
import EnhancedSchoolTable from "../components/SrednjeSkole/SchoolTable";

interface School {
  Program: string;
  Skola: string;
  Mjesto: string;
  Zupanija: string;
  Trajanje: number;
}

export const SrednjeSkole: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0";

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(
          "https://engine.eduformacije.com/api/v1/srednje-skole",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const sortedSchools = [...data].sort((a, b) =>
          a.Program.localeCompare(b.Skola)
        );
        setSchools(sortedSchools);
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
        <Navbar />
        <div className="relative min-h-screen pt-20">
          <AnimatedBackground />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Srednje Škole</h1>
            {loading ? <LoadingSchools /> : <EnhancedSchoolTable schools={schools} />}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

