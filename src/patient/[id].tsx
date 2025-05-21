import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from "@/layouts/default";
import { Input, NumberInput } from "@heroui/react";
import { Button, Textarea } from "@heroui/react";
import { title } from "@/components/primitives";
import ManFun from '@/components/ManFun';
import ExerciseComponent from '@/components/exercises';
import { usePatient, Patient } from "@/PatientContext";
import {addToast} from "@heroui/react"
import { supabase } from "../supabaseClient";


// Ensure these match the types expected by the child components and context
interface ExerciseData {
  id: string;
  name: string;
  resistance: "TB" | "KB" | "DB" | "";
  sets: number;
  reps: number;
}

interface WarmupData {
  id: string;
  name: "Bike" | "NuStep" | "";
  intensity: "Time" | "Distance" | "";
  duration: string;
}

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient, fetchPatients } = usePatient();
  const patientId = id ? parseInt(id) : 0;

  // State declarations
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [warmups, setWarmups] = useState<WarmupData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Removed functionalCategories state as it's not being used
  const [subjective, setSubjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [startTime, setStartTime] = useState<string>(""); // Store as string HH:mm
  const [endTime, setEndTime] = useState<string>("");   // Store as string HH:mm
  const [te, setTe] = useState("");
  const [ta, setTa] = useState("");
  const [man, setMan] = useState("");
  const [nmre, setNmre] = useState("");

  

  // Effect for loading data from localStorage first, then from context
  useEffect(() => {
    let isMounted = true;
    
    // Try to load from localStorage first
   

    // If not in localStorage or loading failed, try from context
    const loadFromContext = () => {
      const patientData = patients[patientId];
      if (patientId && patientData && isMounted) {
        setSubjective(patientData.subjective || "");
        setAssessment(patientData.assessment || "");
        setPlan(patientData.plan || "");
        setStartTime(patientData.startTime || "");
        setEndTime(patientData.endTime || "");
        setTe(patientData.te || "");
        setTa(patientData.ta || "");
        setMan(patientData.man || "");
        setNmre(patientData.nmre || "");
        // Removed loading functionalCategories
        setExercises(patientData.exercisesData || []);
        setWarmups(patientData.warmupsData || []);
        setSelectedCategories(patientData.selectedCategories || []);
        console.log("Loaded patient data from context");
      }
    };

    // Try localStorage first, then fall back to context
    
      loadFromContext();
    

    return () => {
      isMounted = false;
    };
  }, [patientId, patients]);

 
  // Effect for saving data to context (remains similar)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (patientId && patients[patientId]) {
        const currentData = patients[patientId];
        const newData: Partial<Patient> = {
          subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
          exercisesData: exercises, warmupsData: warmups, selectedCategories
          
        };

        // Simplified comparison check
        const hasChanged = JSON.stringify(newData) !== JSON.stringify({
            subjective: currentData.subjective || "", assessment: currentData.assessment || "", plan: currentData.plan || "",
            startTime: currentData.startTime || "", endTime: currentData.endTime || "", te: currentData.te || "", ta: currentData.ta || "",
            man: currentData.man || "", nmre: currentData.nmre || "", 
            exercisesData: currentData.exercisesData || [], warmupsData: currentData.warmupsData || [], selectedCategories: currentData.selectedCategories || []
            // Removed functionalCategories from comparison
        });

        if (hasChanged) {
          updatePatient(patientId, newData);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subjective, assessment, plan, startTime, endTime, te, ta, man, nmre, 
      exercises, warmups, selectedCategories, patientId, updatePatient, patients]);
      // Removed functionalCategories from dependencies

  // Function to save data to Supabase
  const saveToSupabase = async (patientData: Patient) => {
    try {
      // Prepare the data for Supabase
      const { visitId, ...dataToSave } = patientData;
      
      // Update the record in the 'people' table using visitId as the key
      const { data, error } = await supabase
        .from('people')
        .update({
          subjective: dataToSave.subjective,
          assessment: dataToSave.assessment,
          plan: dataToSave.plan,
          startTime: dataToSave.startTime,
          endTime: dataToSave.endTime,
          te: dataToSave.te,
          ta: dataToSave.ta,
          man: dataToSave.man,
          nmre: dataToSave.nmre,
          exercisesData: dataToSave.exercisesData,
          warmupsData: dataToSave.warmupsData,
          // Removed functionalCategories from Supabase update
          selectedCategories: dataToSave.selectedCategories, // Add this line to save selectedCategories
        })
        .eq('visitId', visitId)
        .select();

      if (error) {
        throw error;
      }
      addToast({ title: "Patient data saved successfully.", variant: "flat", timeout: 3000, severity: "success", color: "primary" });
      console.log("Successfully saved to Supabase:", data);
      return data;
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }
  };

  // Handle Back button press with Supabase save
  const handleBackPress = async () => {
    if (patientId && patients[patientId]) {
      try {
        const currentPatientData = patients[patientId];
        // Construct the most up-to-date data from component state
        const dataToSend: Patient = {
          ...currentPatientData, // Base data
          // Overwrite with current state
          subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
          exercisesData: exercises, warmupsData: warmups, selectedCategories
          // Removed functionalCategories
        };
        
        // Save to Supabase
        await saveToSupabase(dataToSend);
        
        // Also send to Google if needed
        
        
        
        
        // Refresh patients data to ensure we have the latest
        await fetchPatients();
        
        // Show success message
        console.log("Patient data saved successfully");
       
      } catch (error) {
        console.error("Error saving patient data:", error);
        // You could add a toast notification here for error feedback
      }
    } else {
      console.warn("No patient data found for ID:", patientId, "Cannot save data.");
    }
    
    // Navigate back regardless of save success/failure
    navigate('/blog');
  };

  // New useEffect to save data when the tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        console.log("Tab is hidden, attempting to save patient data...");
        if (patientId && patients[patientId]) {
          try {
            const currentPatientData = patients[patientId];
            // Construct the most up-to-date data from component state
            const dataToSend: Patient = {
              ...currentPatientData, // Base data
              // Overwrite with current state
              subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
              exercisesData: exercises, warmupsData: warmups, selectedCategories
            };
            await saveToSupabase(dataToSend);
            console.log("Patient data saved successfully on tab hidden.");
          } catch (error) {
            console.error("Error saving patient data on tab hidden:", error);
          }
        } else {
          console.warn("No patient data found for ID:", patientId, "Cannot save data on tab hidden.");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [patientId, patients, subjective, assessment, plan, startTime, endTime, te, ta, man, nmre, exercises, warmups, selectedCategories, saveToSupabase]); // Add all relevant state variables and functions as dependencies

 
  useEffect(() => {
    // Check only after patients have potentially loaded
    if (patientId !== 0 && Object.keys(patients).length > 0 && !patients[patientId]) {
       console.warn(`Patient data not found for ID: ${patientId}. Redirecting.`);
       navigate('/blog');
    }
  }, [patientId, patients, navigate]); // Depend on patients object

 
  // Loading state check
  if (patientId !== 0 && !patients[patientId]) {
     // Show loading only if ID is valid but data isn't loaded yet
     // The effect above handles redirection if data *cannot* be found
     return <div>Loading patient data...</div>;
  }


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 py-6 md:py-10">
        <div className="px-5 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={title({ size: 'sm' })}>{patients[patientId]?.first} {patients[patientId]?.last}</h1>
              <p className="text-default-500">{patients[patientId]?.visitDateTime}</p>
            </div>
            <Button onPress={handleBackPress} variant="flat" size='md'>
              Back
            </Button>
          </div>

          <div className="space-y-6">
            {/* Subjective Textarea */}
            <div>
              <label className="block text-sm font-medium mb-1">Subjective</label>
              <Textarea
                className="w-full"
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                variant='flat'
                minRows={2}
              />
            </div>

            {/* Exercise and ManFun Components */}
            <ExerciseComponent
              exercises={exercises}
              setExercises={setExercises}
              warmups={warmups}
              setWarmups={setWarmups}
            />
            <ManFun
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            {/* Assessment and Plan Textareas */}
            <div>
              <label className="block text-sm font-medium mb-1">Assessment</label>
              <Textarea
                minRows={4}
                className="w-full"
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                variant='flat'
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan</label>
              <Textarea
                className="w-full"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                variant='flat'
                minRows={2}
              />
            </div>

            {/* Number Inputs */}
            <div className=" grid grid-cols-4 md:grid-cols-2 mt-4 gap-4">
              <NumberInput
                label="TE"
                value={Number(te) || 0} // Ensure value is number
                onChange={(value) => setTe(value.toString())} // onChange provides number
                hideStepper={true}
              />
              <NumberInput
                label="TA"
                value={Number(ta) || 0}
                onChange={(value) => setTa(value.toString())}
                hideStepper={true}
              />
              <NumberInput
                label="MAN"
                value={Number(man) || 0}
                onChange={(value) => setMan(value.toString())}
                hideStepper={true}
              />
              <NumberInput
                label="NMRE"
                value={Number(nmre) || 0}
                onChange={(value) => setNmre(value.toString())}
                hideStepper={true}
              />
            </div>

            {/* Time Inputs - Fix the missing onChange handlers */}
            <div className="flex gap-4">
              <Input
                
                type = "text"
                label="Start Time"
                value={startTime}
                onValueChange={(time) => setStartTime(time)}
              />
              <Input
                type="text"
                label="End Time"
                value={endTime}
                onValueChange={(time) => setEndTime(time)}
              />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PatientDetailPage;
