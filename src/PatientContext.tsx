import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { addToast } from "@heroui/react";
import { fetchSpreadsheetData } from "@/components/fetchData"; // Import the Supabase fetch function
import type { Treatment } from "@/types/treatment";
export interface Patient {
  id: number;
  visitId: string;
  visitDateTime: string;
  first: string;
  last: string;

  subjective: string;
  assessment: string;
  plan: string;
  exercises: Exercise[];
  exercisesData?: {
    id: string;
    name: string;
    resistance: "TB" | "KB" | "DB" | "";
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
  selectedCategories?: string[];
  manual?: Treatment[];
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

export const PatientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [patients, setPatients] = useState<Record<number, Patient>>({});
  const location = useLocation();

  // Fetch all patients from Supabase
  const fetchPatients = async () => {
    try {
      // Call the function that fetches from Supabase
      const data = await fetchSpreadsheetData();

      // Check if data is an array (Supabase returns an array or null)
      if (data && Array.isArray(data)) {
        // Create new patient map directly from fetched data
        const patientMap = data.reduce(
          (acc: Record<number, Patient>, patient: any) => {
            acc[patient.id] = {
              id: patient.id,
              visitId: patient.visitId,
              first: patient.first,
              last: patient.last,
              visitDateTime: patient.visitDateTime,
              subjective: patient.subjective || "", // Ensure defaults if needed
              assessment: patient.assessment || "",
              plan: patient.plan || "",
              exercises: [], // Initialize if needed
              exercisesData: patient.exercisesData || [],
              warmupsData: patient.warmupsData || [],
              selectedCategories: patient.selectedCategories || [],
              manual: patient.manual || [], // Ensure defaults if needed
              startTime: patient.startTime,
              endTime: patient.endTime,
              te: patient.te,
              ta: patient.ta,
              man: patient.man,
              nmre: patient.nmre,
            };
            return acc;
          },
          {} as Record<number, Patient>
        );

        // Directly set the state with fetched data
        setPatients(patientMap);
      } else if (data === null) {
        // Handle case where Supabase returns null (e.g., no data)
        console.log("No patient data found in Supabase.");
        setPatients({}); // Clear state if no data
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      addToast({ title: "Failed to load patient data." });
    }
  };

  // Fetch data on initial load and when path changes
  useEffect(() => {
    const loadPatients = async () => {
      console.log("Fetching patients from Supabase..."); // Add log for debugging
      await fetchPatients();
    };

    loadPatients();
  }, [location.pathname]); // Keep dependency on location.pathname
  useEffect(() => {
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page is now visible, refreshing patient data...");
        fetchPatients();
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchPatients]);
  // Update a patient's details in state only
  const updatePatient = (id: number, data: Partial<Patient>) => {
    setPatients((prev) => {
      if (!prev[id]) return prev; // Return previous state if patient doesn't exist

      const updatedPatient = {
        ...prev[id],
        ...data,

        exercisesData: data.exercisesData || prev[id].exercisesData || [],
        warmupsData: data.warmupsData || prev[id].warmupsData || [],
        selectedCategories:
          data.selectedCategories || prev[id].selectedCategories || [],
        manual: data.manual || prev[id].manual || [],
      };

      const updatedPatients = {
        ...prev,
        [id]: updatedPatient,
      };

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
