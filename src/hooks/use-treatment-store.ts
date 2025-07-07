import React from "react";
import type { Treatment } from "../types/treatment";

const STORAGE_KEY = "treatment-data";

export function useTreatmentStore() {
  const [treatments, setTreatments] = React.useState<Treatment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse treatments from localStorage", error);
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treatments));
  }, [treatments]);

  const addTreatment = (treatment: Treatment) => {
    setTreatments((prev) => {
      const exists = prev.some(
        (t) =>
          t.area === treatment.area &&
          t.target === treatment.target &&
          t.type === treatment.type
      );
      if (exists) {
        console.warn("Attempted to add a duplicate treatment.");
        return prev;
      }
      return [...prev, treatment];
    });
  };

  const updateTreatment = (id: string, updatedTreatment: Treatment) => {
    setTreatments((prev) =>
      prev.map((t) => (t.id === id ? updatedTreatment : t))
    );
  };

  const removeTreatment = (id: string) => {
    setTreatments((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      console.log(
        "Removing treatment with id:",
        id,
        "Updated treatments:",
        updated
      );
      return updated;
    });
  };

  return {
    treatments,
    addTreatment,
    updateTreatment,
    removeTreatment,
  };
}
