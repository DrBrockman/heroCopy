import  { useEffect } from 'react';
import { usePatient } from "@/PatientContext";
import PersonCard from '@/components/patient-card';
import { Spinner } from "@heroui/react";

const DataDisplay = () => {
  const { patients } = usePatient();

  // Fetch patients data only on first load or when API is called
  useEffect(() => {
   
  }, [patients]);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mt-3">
      {/* Check if we have a list of patients to map over */}
      {Object.keys(patients).length > 0 ? (
        Object.values(patients).map((person) => (
          <div key={person.id} className="w-full">
            <PersonCard person={person} />
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center py-10">
          <Spinner classNames={{ label: "text-foreground mt-4" }} label="Getting Your Patients" variant="wave" />
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
