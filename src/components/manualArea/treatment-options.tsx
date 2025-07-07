import { Card } from "@heroui/react";
import type { TreatmentType } from "@/types/treatment";
import { jointMap } from "./joint-options";
interface TreatmentOptionsProps {
  onSelect: (area: string) => void;
  type: TreatmentType;
}
const muscleMap: Record<string, boolean> = {
  "Cervical & Shoulder": true,
  "Anterior Torso": true,
  "Posterior Torso": true,
  Lumbopelvic: true,
  LE: true,
  Ankle: true,
  UE: true,
};

export function TreatmentOptions({ onSelect, type }: TreatmentOptionsProps) {
  let areas = [
    "Cervical & Shoulder",
    "Spine",
    "Shoulder",
    "UE",
    "Anterior Torso",
    "Posterior Torso",
    "Lumbopelvic",
    "LE",
    "Ankle",
    "Foot",
    "Knee",
    "Hip",
    "Wrist",
    "Elbow",
  ];
  if (type === "joint-mobilization") {
    areas = areas.filter((area) => jointMap[area]);
  }
  if (type === "dry-needling" || type === "soft-tissue") {
    areas = areas.filter((area) => muscleMap[area]);
  }
  return (
    <div className="grid grid-cols-3 gap-2 ">
      {areas.map((area) => (
        <Card
          key={area}
          isPressable
          onPress={() => onSelect(area)}
          className="p-4 text-center  text-lg hover:bg-default-100"
        >
          {area}
        </Card>
      ))}
    </div>
  );
}
