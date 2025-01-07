// src/types/school.d.ts
export interface Program {
    skolaProgramRokId: string;
    program: string;
  }
  
  export interface SchoolDetails {
    Skola: string;
    EMail: string;
    BrojTelefona: string;
    Web: string;
    Adresa: string;
    Mjesto: string;
    Program: string;
    Zupanija: string;
    SkolaProgramRokId: string;
  }
  
  export interface GroupedProgram {
    programName: string;
    schools: SchoolDetails[];
  }
  