import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TreatmentOptions } from "./treatment-options";
import { MuscleOptions } from "./muscle-options";
import { JointOptions } from "./joint-options";

import type {
  Treatment,
  TreatmentType,
  SoftTissueOptions,
  JointMobilizationOptions,
  DryNeedlingOptions,
  SoftTissueTreatment,
  JointMobilizationTreatment,
  DryNeedlingTreatment,
} from "@/types/treatment";

interface TreatmentSelectorProps {
  onClose: () => void;
  type: TreatmentType;
  manual: Treatment[];
  setManual: (updateFn: (prevManual: Treatment[]) => Treatment[]) => void; // Updated type for clarity
}

export function TreatmentSelector({
  type,
  manual,
  setManual,
}: TreatmentSelectorProps) {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);

  // All treatments for the selected area and type
  const areaTreatments = React.useMemo(() => {
    if (!selectedArea) return [];
    return manual.filter((t) => t.area === selectedArea && t.type === type);
  }, [manual, selectedArea, type]);

  // All treatments for the current type (regardless of area)
  const typeTreatments = React.useMemo(
    () => manual.filter((t) => t.type === type),
    [manual, type]
  );

  // Handler for toggling a target (muscle/joint)
  const handleTargetToggle = (target: string) => {
    const exists = areaTreatments.find((t) => t.target === target);
    if (exists) {
      // Use functional update to remove item
      setManual((prevManual) => prevManual.filter((t) => t.id !== exists.id));
    } else if (selectedArea) {
      // Add a new treatment with default options
      const baseTreatment = {
        id: `${Date.now()}-${target}-${Math.random()}`,
        area: selectedArea,
        target,
      };
      let newTreatment: Treatment;
      switch (type) {
        case "joint-mobilization":
          newTreatment = {
            ...baseTreatment,
            type: "joint-mobilization",
            options: {
              gradeI: false,
              gradeII: false,
              gradeIII: false,
              gradeIV: false,
              thrust: false,
            },
          } as JointMobilizationTreatment;
          break;
        case "dry-needling":
          newTreatment = {
            ...baseTreatment,
            type: "dry-needling",
            options: {
              hzStimulation: false,
              localTwitch: false,
              reproducePain: false,
            },
          } as DryNeedlingTreatment;
          break;
        case "soft-tissue":
        default:
          newTreatment = {
            ...baseTreatment,
            type: "soft-tissue",
            options: {
              cupping: false,
              theragun: false,
              strumming: false,
              sustained: false,
            },
          } as SoftTissueTreatment;
          break;
      }
      // Use functional update to add item
      setManual((prevManual) => [...prevManual, newTreatment]);
    }
  };

  // Option toggle handlers
  const updateTreatment = (id: string, updated: Treatment) => {
    // Use functional update to modify an item
    setManual((prevManual) =>
      prevManual.map((t) => (t.id === id ? updated : t))
    );
  };

  const handleSoftTissueToggle = (
    treatment: SoftTissueTreatment,
    optionKey: keyof SoftTissueOptions
  ) => {
    updateTreatment(treatment.id, {
      ...treatment,
      options: {
        ...treatment.options,
        [optionKey]: !treatment.options[optionKey],
      },
    });
  };

  const handleJointToggle = (
    treatment: JointMobilizationTreatment,
    optionKey: keyof JointMobilizationOptions
  ) => {
    updateTreatment(treatment.id, {
      ...treatment,
      options: {
        ...treatment.options,
        [optionKey]: !treatment.options[optionKey],
      },
    });
  };

  const handleDryNeedlingToggle = (
    treatment: DryNeedlingTreatment,
    optionKey: keyof DryNeedlingOptions
  ) => {
    updateTreatment(treatment.id, {
      ...treatment,
      options: {
        ...treatment.options,
        [optionKey]: !treatment.options[optionKey],
      },
    });
  };

  // Navigation
  const handleBack = () => setSelectedArea(null);

  // List of added targets for styling
  const addedTargets = areaTreatments.map((t) => t.target);

  // THIS IS THE KEY FIX
  function removeTreatment(id: string): void {
    // Use the functional update form of setManual
    setManual((prevManual) => prevManual.filter((t) => t.id !== id));
  }

  // UI rendering
  return (
    <div className="space-y-4">
      {selectedArea ? (
        <>
          <Button
            variant="light"
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={handleBack}
          >
            Back to Areas
          </Button>
          {(type === "soft-tissue" || type === "dry-needling") && (
            <MuscleOptions
              area={selectedArea}
              onToggle={handleTargetToggle}
              addedTargets={addedTargets}
            />
          )}
          {type === "joint-mobilization" && (
            <JointOptions
              area={selectedArea}
              onToggle={handleTargetToggle}
              addedTargets={addedTargets}
            />
          )}
          {/* Show all selected treatments for this area/type */}
          {areaTreatments.length > 0 && (
            <div className="space-y-4 mt-4">
              {areaTreatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="p-2 border rounded-lg bg-content1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-md font-semibold">
                        {treatment.target}
                      </h3>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => removeTreatment(treatment.id)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                  {/* Treatment Options */}
                  {treatment.type === "soft-tissue" && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["cupping", "Cupping"],
                          ["theragun", "Theragun"],
                          ["strumming", "Strumming"],
                          ["sustained", "Sustained Pressure"],
                        ] as [keyof SoftTissueOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleSoftTissueToggle(
                              treatment as SoftTissueTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                            (treatment as SoftTissueTreatment).options[key]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {treatment.type === "joint-mobilization" && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["gradeI", "Grade I"],
                          ["gradeII", "Grade II"],
                          ["gradeIII", "Grade III"],
                          ["gradeIV", "Grade IV"],
                          ["thrust", "Thrust"],
                        ] as [keyof JointMobilizationOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleJointToggle(
                              treatment as JointMobilizationTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                            (treatment as JointMobilizationTreatment).options[
                              key
                            ]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {treatment.type === "dry-needling" && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["hzStimulation", "w/ 2 hz Electrical Stimulation"],
                          ["localTwitch", "Local Twitch Response"],
                          ["reproducePain", "Reproduction of Patient's pain"],
                        ] as [keyof DryNeedlingOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleDryNeedlingToggle(
                              treatment as DryNeedlingTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                            (treatment as DryNeedlingTreatment).options[key]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <TreatmentOptions onSelect={setSelectedArea} type={type} />

          {/* Show all selected treatments for this type (added targets) */}
          {typeTreatments.length > 0 && (
            <div className="space-y-4 mt-4">
              {typeTreatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="p-2 border rounded-lg bg-content"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-md ">
                        {treatment.target}
                        <span className="text-small text-default-500 ps-1">
                          ({treatment.type})
                        </span>
                      </h3>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => removeTreatment(treatment.id)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                  {/* Treatment Options UI (same as in area view) */}
                  {treatment.type === "soft-tissue" && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["cupping", "Cupping"],
                          ["theragun", "Theragun"],
                          ["strumming", "Strumming"],
                          ["sustained", "Sustained"],
                        ] as [keyof SoftTissueOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleSoftTissueToggle(
                              treatment as SoftTissueTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                            (treatment as SoftTissueTreatment).options[key]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {treatment.type === "joint-mobilization" && (
                    <div className="flex text-sm flex-nowrap gap-2">
                      {(
                        [
                          ["gradeI", "Grade I"],
                          ["gradeII", "Grade II"],
                          ["gradeIII", "Grade III"],
                          ["gradeIV", "Grade IV"],
                          ["thrust", "Thrust"],
                        ] as [keyof JointMobilizationOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleJointToggle(
                              treatment as JointMobilizationTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center text-sm rounded-full px-2 py-1 transition-all duration-200 ${
                            (treatment as JointMobilizationTreatment).options[
                              key
                            ]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {treatment.type === "dry-needling" && (
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["hzStimulation", "w/ 2 hz Electrical Stimulation"],
                          ["localTwitch", "Local Twitch response"],
                          ["reproducePain", "Reproduction of Patient's pain"],
                        ] as [keyof DryNeedlingOptions, string][]
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleDryNeedlingToggle(
                              treatment as DryNeedlingTreatment,
                              key
                            )
                          }
                          className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                            (treatment as DryNeedlingTreatment).options[key]
                              ? "bg-primary text-white font-semibold shadow-md hover:bg-primary-600"
                              : "bg-content1 text-default-800 font-semibold border border-default-200 hover:bg-default-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
