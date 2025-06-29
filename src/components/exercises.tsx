import React from "react";
import {
  Card,
  Input,
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
  };

  const deleteWarmup = (id: string) => {
    const newWarmups = warmups.filter((wm) => wm.id !== id);
    setWarmups(newWarmups);
    // Remove direct context update - parent will handle saving
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      <h2 className="text-l font-semibold">Treatment</h2>
      <div className="flex flex-nowrap gap-2 justify-between ">
        {/* Conditionally render the Add Warm Up dropdown */}

        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
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

      {exercises.map((exercise) => (
        <Card key={exercise.id} className="p-4 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              type="text"
              size="sm"
              variant="flat"
              value={exercise.name}
              onChange={(e) =>
                updateExercise(exercise.id, "name", e.target.value)
              }
              onKeyPress={handleKeyPress}
              className="w-full sm:w-1/3"
              placeholder="Exercise name"
              data-id={exercise.id}
            />

            <div className="flex gap-2 w-full sm:w-2/3">
              {/* Sets */}
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" className="w-full" color="primary">
                    Sets: {exercise.sets}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Set Options"
                  onAction={(key) =>
                    updateExercise(exercise.id, "sets", key.toString())
                  }
                >
                  {[1, 2, 3, 4, 5].map((option) => (
                    <DropdownItem key={option.toString()}>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Reps */}
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" className="w-full" color="primary">
                    Reps: {exercise.reps}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Rep Options"
                  onAction={(key) =>
                    updateExercise(exercise.id, "reps", key.toString())
                  }
                >
                  {[1, 3, 5, 6, 8, 10, 12, 15, 20].map((option) => (
                    <DropdownItem key={option.toString()}>
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Delete Button */}
              <Button
                isIconOnly
                color="danger"
                variant="light"
                onPress={() => deleteExercise(exercise.id)}
                className="shrink-0"
              >
                <Icon icon="lucide:trash-2" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
export default Exercise;
