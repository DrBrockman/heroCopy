import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from "@/layouts/default";
import { Input } from "@heroui/react";
import { Button, Textarea } from "@heroui/react";
import { title } from "@/components/primitives";
import ManFun from '@/components/ManFun';
import ExerciseComponent from '@/components/exercises';
import { usePatient, Patient } from "@/PatientContext";
import {addToast} from "@heroui/react"
import { supabase } from "../supabaseClient";
import { NumberPadModal } from '@/components/NumberpadModal';

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

// Define the type for the fields that will use the number pad
type CptField = "TE" | "TA" | "MAN" | "NMRE";

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient, fetchPatients } = usePatient();
  const patientId = id ? parseInt(id) : 0;

  // State declarations
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [warmups, setWarmups] = useState<WarmupData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [subjective, setSubjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [startTime, setStartTime] = useState<string>(""); 
  const [endTime, setEndTime] = useState<string>("");   
  const [te, setTe] = useState("");
  const [ta, setTa] = useState("");
  const [man, setMan] = useState("");
  const [nmre, setNmre] = useState("");

  // State for managing the number pad modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditingField, setCurrentEditingField] = useState<CptField | null>(null);

  // Effect for loading data from localStorage first, then from context
  useEffect(() => {
    let isMounted = true;
    
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
        setExercises(patientData.exercisesData || []);
        setWarmups(patientData.warmupsData || []);
        setSelectedCategories(patientData.selectedCategories || []);
        console.log("Loaded patient data from context");
      }
    };

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

        const hasChanged = JSON.stringify(newData) !== JSON.stringify({
            subjective: currentData.subjective || "", assessment: currentData.assessment || "", plan: currentData.plan || "",
            startTime: currentData.startTime || "", endTime: currentData.endTime || "", te: currentData.te || "", ta: currentData.ta || "",
            man: currentData.man || "", nmre: currentData.nmre || "", 
            exercisesData: currentData.exercisesData || [], warmupsData: currentData.warmupsData || [], selectedCategories: currentData.selectedCategories || []
        });

        if (hasChanged) {
          updatePatient(patientId, newData);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subjective, assessment, plan, startTime, endTime, te, ta, man, nmre, 
      exercises, warmups, selectedCategories, patientId, updatePatient, patients]);
      
  // Function to save data to Supabase
  const saveToSupabase = async (patientData: Patient) => {
    try {
      const { visitId, ...dataToSave } = patientData;
      
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
          selectedCategories: dataToSave.selectedCategories,
        })
        .eq('visitId', visitId)
        .select();

      if (error) throw error;

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
        const dataToSend: Patient = {
          ...currentPatientData,
          subjective, assessment, plan, startTime, endTime, te, ta, man, nmre,
          exercisesData: exercises, warmupsData: warmups, selectedCategories
        };
        await saveToSupabase(dataToSend);
        await fetchPatients();
        console.log("Patient data saved successfully");
      } catch (error) {
        console.error("Error saving patient data:", error);
      }
    } else {
      console.warn("No patient data found for ID:", patientId, "Cannot save data.");
    }
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
            const dataToSend: Patient = {
              ...currentPatientData, 
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
  }, [patientId, patients, subjective, assessment, plan, startTime, endTime, te, ta, man, nmre, exercises, warmups, selectedCategories, saveToSupabase]);
 
  useEffect(() => {
    if (patientId !== 0 && Object.keys(patients).length > 0 && !patients[patientId]) {
       console.warn(`Patient data not found for ID: ${patientId}. Redirecting.`);
       navigate('/blog');
    }
  }, [patientId, patients, navigate]);
 
  if (patientId !== 0 && !patients[patientId]) {
     return <div>Loading patient data...</div>;
  }

  // Functions to handle the modal
  const handleOpenModal = (field: CptField) => {
    setCurrentEditingField(field);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEditingField(null);
  };

  const cptFields: CptField[] = ["TE", "TA", "MAN", "NMRE"];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentEditingField) return;
    
    const currentIndex = cptFields.indexOf(currentEditingField);
    let nextIndex;

    if (direction === 'right') {
      nextIndex = (currentIndex + 1) % cptFields.length;
    } else { // 'left'
      nextIndex = (currentIndex - 1 + cptFields.length) % cptFields.length;
    }
    
    setCurrentEditingField(cptFields[nextIndex]);
  };
  
  const getValueForField = (field: CptField | null): string => {
    if (!field) return "";
    switch (field) {
      case "TE": return te;
      case "TA": return ta;
      case "MAN": return man;
      case "NMRE": return nmre;
      default: return "";
    }
  };

  const setValueForField = (field: CptField | null, value: string) => {
    if (!field) return;
    switch (field) {
      case "TE": setTe(value); break;
      case "TA": setTa(value); break;
      case "MAN": setMan(value); break;
      case "NMRE": setNmre(value); break;
    }
  };

  // A small component to render the clickable input fields
  const ModalInputTrigger = ({ label, value, onClick }: { label: string, value: string, onClick: () => void }) => (
    <div onClick={onClick} className="cursor-pointer">
      <label className="block text-sm font-medium text-foreground-500 mb-1">{label}</label>
      <div className="w-full h-12 flex items-center px-3 bg-default-100 hover:bg-default-200 transition-colors rounded-lg">
        <span className="text-lg">{value || '0'}</span>
      </div>
    </div>
  );


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

            {/* Replaced Number Inputs with Modal Triggers */}
            <div className="grid grid-cols-4 md:grid-cols-2 mt-4 gap-4">
               <ModalInputTrigger label="TE" value={te} onClick={() => handleOpenModal("TE")} />
               <ModalInputTrigger label="TA" value={ta} onClick={() => handleOpenModal("TA")} />
               <ModalInputTrigger label="MAN" value={man} onClick={() => handleOpenModal("MAN")} />
               <ModalInputTrigger label="NMRE" value={nmre} onClick={() => handleOpenModal("NMRE")} />
            </div>

            {/* Time Inputs */}
            <div className="flex gap-4">
              <Input
                type="text"
                label="Start Time"
                value={startTime}
                onValueChange={setStartTime}
              />
              <Input
                type="text"
                label="End Time"
                value={endTime}
                onValueChange={setEndTime}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Render the modal conditionally */}
      {isModalOpen && (
        <NumberPadModal
          onClose={handleCloseModal}
          label={currentEditingField || ""}
          value={getValueForField(currentEditingField)}
          onValueChange={(newValue) => setValueForField(currentEditingField, newValue)}
          onSwipe={handleSwipe}
        />
      )}
    </DefaultLayout>
  );
};

export default PatientDetailPage;