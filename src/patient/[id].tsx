import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from "@/layouts/default";
// Import TimeValue if needed for TimeInput state or parsing
import { TimeInput, NumberInput,  } from "@heroui/react";
import { Button, Textarea } from "@heroui/react";
import { title } from "@/components/primitives";

import ManFun from '@/components/ManFun';
import ExerciseComponent from '@/components/exercises';
import { usePatient, Patient } from "@/PatientContext";


// Ensure these match the types expected by the child components and context
interface ExerciseData {
  id: string;
  name: string;
  resistance: "TB" | "KB" | "DB";
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
  // location might not be needed if not using location.state.person
  // const location = useLocation();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatient();
  const patientId = id ? parseInt(id) : 0;

  // State declarations (ensure no duplicates)
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [warmups, setWarmups] = useState<WarmupData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [functionalCategories, setFunctionalCategories] = useState<{ id: number; label: string }[]>([]);
  const [subjective, setSubjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [startTime, setStartTime] = useState<string>(""); // Store as string HH:mm
  const [endTime, setEndTime] = useState<string>("");   // Store as string HH:mm
  const [te, setTe] = useState("");
  const [ta, setTa] = useState("");
  const [man, setMan] = useState("");
  const [nmre, setNmre] = useState("");

  

  // Effect for loading data (remains the same)
  useEffect(() => {
    let isMounted = true;
    const patientData = patients[patientId];

    if (patientId && patientData && isMounted) {
      setSubjective(patientData.subjective || "");
      setAssessment(patientData.assessment || "");
      setPlan(patientData.plan || "");
      setStartTime(patientData.startTime || ""); // Load string time
      setEndTime(patientData.endTime || "");   // Load string time
      setTe(patientData.te || "");
      setTa(patientData.ta || "");
      setMan(patientData.man || "");
      setNmre(patientData.nmre || "");
      setFunctionalCategories(patientData.functionalCategories || []);
      setExercises(patientData.exercisesData || []);
      setWarmups(patientData.warmupsData || []);
      setSelectedCategories(patientData.selectedCategories || []);
    }

    return () => {
      isMounted = false;
    };
  }, [patientId, patients]);

  // Effect for saving data (remains the same)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (patientId && patients[patientId]) {
        const currentData = patients[patientId];
        const newData: Partial<Patient> = {
          subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
          functionalCategories, exercisesData: exercises, warmupsData: warmups, selectedCategories
        };

        // Simplified comparison check (adjust if deep comparison needed)
        const hasChanged = JSON.stringify(newData) !== JSON.stringify({
            subjective: currentData.subjective || "", assessment: currentData.assessment || "", plan: currentData.plan || "",
            startTime: currentData.startTime || "", endTime: currentData.endTime || "", te: currentData.te || "", ta: currentData.ta || "",
            man: currentData.man || "", nmre: currentData.nmre || "", functionalCategories: currentData.functionalCategories || [],
            exercisesData: currentData.exercisesData || [], warmupsData: currentData.warmupsData || [], selectedCategories: currentData.selectedCategories || []
        });

        if (hasChanged) {
          updatePatient(patientId, newData);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subjective, assessment, plan, startTime, endTime, te, ta, man, nmre, functionalCategories, exercises, warmups, selectedCategories, patientId, updatePatient, patients]);

  

  // Effect for redirecting if patient data is not found (Top Level)
  useEffect(() => {
    // Check only after patients have potentially loaded
    if (patientId !== 0 && Object.keys(patients).length > 0 && !patients[patientId]) {
       console.warn(`Patient data not found for ID: ${patientId}. Redirecting.`);
       navigate('/blog');
    }
  }, [patientId, patients, navigate]); // Depend on patients object

  // Function to send data to Google Apps Script (remains the same)
  const sendPatientDataToGoogle = async (patientData: Patient) => {
    const url = "https://script.google.com/macros/s/AKfycbw7fO3QrGqPd3DM1dp6_FRDI8DYDSwPESHC0A83mjed1sTmFQeVowVUPpXv7o89tyADbg/exec";
    const payload = {
      action: "addVisitToQue",
      info: JSON.stringify([patientData])
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      console.log("Google Script Response:", text);
      try {
        const data = JSON.parse(text);
        console.log("Parsed Google Script Response:", data);
      } catch (error) {
        console.warn("Response from Google Script was not valid JSON:", text);
      }
    } catch (error) {
      console.error("Error sending data to Google Script:", error);
    }
  };

  // Handle Back button press (declared once)
  const handleBackPress = async () => {
    if (patientId && patients[patientId]) {
       const currentPatientData = patients[patientId];
       // Construct the most up-to-date data from component state
       const dataToSend: Patient = {
         ...currentPatientData, // Base data
         // Overwrite with current state
         subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
         functionalCategories, exercisesData: exercises, warmupsData: warmups, selectedCategories
       };
      await sendPatientDataToGoogle(dataToSend);
    } else {
      console.warn("No patient data found for ID:", patientId, "Cannot send to Google.");
    }
    navigate('/blog');
  };

  

  // Loading state check
  if (patientId !== 0 && !patients[patientId]) {
     // Show loading only if ID is valid but data isn't loaded yet
     // The effect above handles redirection if data *cannot* be found
     return <div>Loading patient data...</div>;
  }

  


  return (
    <DefaultLayout>
      <section className=" flex flex-col items-center  gap-4 py-6 md:py-10">
      <div className="px-5 mx-auto  ">
          <div className="flex justify-between items-center mb-6">
            <div>
              {/* Rely solely on patient data from context */}
              <h1 className={title({ size: 'sm' })}>{patients[patientId]?.first} {patients[patientId]?.last}</h1>
              <p className="text-default-500">{patients[patientId]?.date}</p>
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

            {/* Time Inputs */}
            <div className="flex items-center grid-cols-2  mt-4">
              <TimeInput
                label="Start Time"
                labelPlacement='outside-left'
                variant='underlined'
                
                // onChange provides TimeValue, format it back to string
              />
              <TimeInput
                label="End Time"
                labelPlacement='outside-left'
                variant='underlined'
               
              />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PatientDetailPage;
