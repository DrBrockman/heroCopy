import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface Patient {
  id: number;
  first: string;
  last: string;
  date: string;
  subjective: string;
  assessment: string;
  plan: string;
  exercises: Exercise[];
  exercisesData?: {
    id: string;
    name: string;
    resistance: "TB" | "KB" | "DB";
    sets: number;
    reps: number;
  }[];
  warmupsData?: {
    id: string;
    name: "Bike" | "NuStep" | "";
    intensity: "Time" | "Distance" | "";
    duration: string;
  }[];
  startTime?: string;
  endTime?: string;
  te?: string;
  ta?: string;
  man?: string;
  nmre?: string;
  functionalCategories?: { id: number; label: string }[];
  selectedCategories?: string[]; // Add this line
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface PatientContextType {
  patients: Record<number, Patient>;
  updatePatient: (id: number, data: Partial<Patient>) => void;
  fetchPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: React.ReactNode }) => {
  const [patients, setPatients] = useState<Record<number, Patient>>({});
  const location = useLocation();
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null); // Use useRef for the timeout ID

  // Fetch all patients from API
  const fetchPatients = async () => {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw7fO3QrGqPd3DM1dp6_FRDI8DYDSwPESHC0A83mjed1sTmFQeVowVUPpXv7o89tyADbg/exec?action=fetchSpreadsheetData");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      
      // Assuming the array of patients is under the people key
      if (data.people && Array.isArray(data.people)) {
        // Get current patients from localStorage
        const storedPatients = localStorage.getItem("patients");
        const currentPatients = storedPatients ? JSON.parse(storedPatients) : {};
        
        // Create new patient map from fetched data
        const patientMap = data.people.reduce((acc: Record<number, Patient>, patient: Patient) => {
          acc[patient.id] = {
            ...patient,
            exercisesData: patient.exercisesData || [],
            warmupsData: patient.warmupsData || [],
            functionalCategories: patient.functionalCategories || [],
            selectedCategories: patient.selectedCategories || [] // Ensure this is handled
          };
          return acc;
        }, {} as Record<number, Patient>);
        
        // Remove patients from localStorage that are no longer in the fetched data
        const fetchedIds = new Set(data.people.map((p: Patient) => p.id));
        const cleanedPatients = Object.fromEntries(
          Object.entries(currentPatients)
            .filter(([id]) => fetchedIds.has(parseInt(id)))
        );
        
        // Merge remaining local patients with fetched data
        const mergedPatients = {
          ...cleanedPatients,
          ...patientMap
        };

        // Save to localStorage to persist data
        localStorage.setItem("patients", JSON.stringify(mergedPatients));
        setPatients(mergedPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Check if patients are in localStorage before fetching from API
  useEffect(() => {
    const loadPatients = async () => {
      const storedPatients = localStorage.getItem("patients");
      if (storedPatients) {
        try {
          const parsedPatients = JSON.parse(storedPatients);
          // Ensure all patients have required arrays initialized
          const initializedPatients = Object.entries(parsedPatients).reduce((acc, [id, patient]) => {
            acc[parseInt(id)] = {
              ...patient as Patient,
              exercisesData: (patient as Patient).exercisesData || [],
              warmupsData: (patient as Patient).warmupsData || [],
              functionalCategories: (patient as Patient).functionalCategories || [],
              selectedCategories: (patient as Patient).selectedCategories || [] // Ensure this is handled
            };
            return acc;
          }, {} as Record<number, Patient>);
          setPatients(initializedPatients);
        } catch (error) {
          console.error("Error parsing patients from localStorage:", error);
        }
      }
      
      if (location.pathname === "/") {
        await fetchPatients();
      }
    };
    
    loadPatients();
  }, [location.pathname]);

  // Update a patient's details with debounced localStorage update
  const updatePatient = (id: number, data: Partial<Patient>) => {
    setPatients((prev) => {
      if (!prev[id]) return prev;
      
      const updatedPatient = {
        ...prev[id],
        ...data,
        // Ensure arrays are always initialized
        exercisesData: data.exercisesData || prev[id].exercisesData || [],
        warmupsData: data.warmupsData || prev[id].warmupsData || [],
        functionalCategories: data.functionalCategories || prev[id].functionalCategories || [],
        selectedCategories: data.selectedCategories || prev[id].selectedCategories || [] 
      };
      
      const updatedPatients = {
        ...prev,
        [id]: updatedPatient
      };
      
      // Clear the previous timeout if it exists
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce localStorage updates for better performance
      // Store the new timeout ID in the ref
      debounceTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("patients", JSON.stringify(updatedPatients));
        debounceTimeoutRef.current = null; // Clear the ref after execution
      }, 300); 
      
      return updatedPatients;
    });
  };

  return (
    <PatientContext.Provider value={{ patients, updatePatient, fetchPatients }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
