import React from "react";
import {
  Card,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
// First install @iconify/react with: npm install @iconify/react
import { Icon } from "@iconify/react";

// Define Props interface
interface ExerciseProps {
  exercises: ExerciseData[]; // Use the specific type from PatientContext/PatientDetailPage
  setExercises: (exercises: ExerciseData[]) => void;
  warmups: WarmupData[]; // Use the specific type from PatientContext/PatientDetailPage
  setWarmups: (warmups: WarmupData[]) => void;
}

// Define internal types (or import from a shared types file)
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

// Update component signature to accept props
function Exercise({
  exercises,
  setExercises,
  warmups,
  setWarmups,
}: ExerciseProps) {
  

  const [newExerciseId, setNewExerciseId] = React.useState<string | null>(null);

  

  const addNewExercise = () => {
    const id = Math.random().toString(36).substring(7);
    // Use ExerciseData type
    const newExercise: ExerciseData = {
      id,
      name: "",
      resistance: "",
      sets: 3,
      reps: 10,
    };
    // Use the setExercises prop
    setExercises([...exercises, newExercise]);
    setNewExerciseId(id);
  };

  const addNewWarmup = (name: "Bike" | "NuStep") => {
    // Use WarmupData type
    const newWarmup: WarmupData = {
      id: Math.random().toString(36).substring(7),
      name: name,
      intensity: name === "Bike" ? "Time" : "",
      duration: name === "Bike" ? "5" : "",
    };
    // Use the setWarmups prop
    setWarmups([...warmups, newWarmup]);
  };

  // Update functions to use setExercises/setWarmups props
  const updateExercise = (
    id: string,
    field: keyof ExerciseData,
    value: any
  ) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const updateWarmup = (id: string, field: keyof WarmupData, value: any) => {
    setWarmups(
      warmups.map((wm) => (wm.id === id ? { ...wm, [field]: value } : wm))
    );
  };

  const deleteExercise = (id: string) => {
    const newExercises = exercises.filter((ex) => ex.id !== id);
    setExercises(newExercises);
    // Remove direct context update - parent will handle saving
    /*
    if (patientId) {
      updatePatient(patientId, {
        exercisesData: newExercises
      });
    }
    */
  };

  const deleteWarmup = (id: string) => {
    const newWarmups = warmups.filter((wm) => wm.id !== id);
    setWarmups(newWarmups);
    // Remove direct context update - parent will handle saving
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    
  ) => {
    if (e.key === "Enter") {
      // Potentially find the next input or just add new exercise
      addNewExercise();
    }
  };

  // Use effect to focus the new exercise input
  React.useEffect(() => {
    if (newExerciseId) {
      const input = document.querySelector(
        `input[data-id="${newExerciseId}"]`
      ) as HTMLInputElement;
      if (input) {
        input.focus();
        setNewExerciseId(null); // Reset the ID after focusing
      }
    }
  }, [newExerciseId]); // Only depend on newExerciseId

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold">Treatment</h2>
      <div className="flex flex-nowrap gap-2 justify-between ">
        {/* Conditionally render the Add Warm Up dropdown */}
        {warmups.length === 0 && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="primary"
                startContent={<Icon icon="lucide:plus" />}
              >
                Warm Up
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Warmup Type"
              onAction={(key) => addNewWarmup(key as "Bike" | "NuStep")} // Call addNewWarmup with selected key
            >
              <DropdownItem key="Bike" textValue="Bike">
                Bike
              </DropdownItem>
              <DropdownItem key="NuStep" textValue="NuStep">
                NuStep
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <Button
          color="primary"
          onPress={addNewExercise}
          startContent={<Icon icon="lucide:plus" />}
        >
          Exercise
        </Button>
       
        <Button
          color="primary"
          onPress={addNewExercise}
          startContent={<Icon icon="lucide:plus" />}
        >
          Stretches
        </Button>
       
      </div>

      {warmups.length > 0 && (
        <Card className="w-full">
          <div className="pl-4 pt-2 font-semibold text-lg">Warm Up</div>
          <div className="overflow-x-auto"> 
          <Table removeWrapper aria-label="Warm up table" hideHeader>
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Intensity</TableColumn>
              <TableColumn>Duration</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {warmups.map((wm) => (
                <TableRow key={wm.id}>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" className="w-32">
                          {wm.name || "Choose"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Warmup Name"
                        onAction={(key) => updateWarmup(wm.id, "name", key)}
                      >
                        <DropdownItem key="Bike" textValue="Bike">
                          Bike
                        </DropdownItem>
                        <DropdownItem key="NuStep" textValue="NuStep">
                          NuStep
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" className="w-32">
                          {wm.intensity || "Choose"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Warmup Intensity"
                        onAction={(key) =>
                          updateWarmup(wm.id, "intensity", key)
                        }
                      >
                        <DropdownItem key="Time" textValue="Time">
                          Time
                        </DropdownItem>
                        <DropdownItem key="Distance" textValue="Distance">
                          Distance
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={wm.duration}
                      onChange={(e) =>
                        updateWarmup(wm.id, "duration", e.target.value)
                      }
                      className="w-32 p-2 rounded-lg border border-default-200 bg-transparent"
                      placeholder="Enter duration"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => deleteWarmup(wm.id)}
                    >
                      <Icon icon="lucide:trash-2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Card>
      )}

      {exercises.length > 0 && (
        <Card className="w-full">
          <div className="pl-2 pt-2 font-semibold text-lg">Exercises</div>
          <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Workout exercises table"
            
          >
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Resistance</TableColumn>
              <TableColumn>Sets</TableColumn>
              <TableColumn>Reps</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell className="whitespace-nowrap">
                      <input 
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(exercise.id, "name", e.target.value)
                        }
                        onKeyPress={(e) => handleKeyPress(e)}
                        className=" p-2 rounded-lg border border-default-200 bg-transparent"
                        placeholder="Exercise name"
                        data-id={exercise.id}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            "sets",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-10 p-2 rounded-lg border border-default-200 bg-transparent"
                        min="0"
                      />
                    </TableCell>
                    
                    <TableCell className="whitespace-nowrap">
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            "reps",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-10 p-2 rounded-lg border border-default-200 bg-transparent"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" className="w-10">
                            {exercise.resistance}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Resistance types"
                          onAction={(key) =>
                            updateExercise(exercise.id, "resistance", key)
                          }
                        >
                          <DropdownItem key="TB">TB</DropdownItem>
                          <DropdownItem key="KB">KB</DropdownItem>
                          <DropdownItem key="DB">DB</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => deleteExercise(exercise.id)}
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
        </Card>
      )}
    </div>
  );
}
export default Exercise;
