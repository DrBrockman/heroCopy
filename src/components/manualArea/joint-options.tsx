import { Card } from "@heroui/react";

interface JointOptionsProps {
  area: string;
  onToggle: (joint: string) => void;
  addedTargets: string[];
}

export const jointMap: Record<string, string[]> = {
  Spine: ["Cervical Spine", "Thoracic Spine", "Lumbar Spine"],
  Hip: ["Femoroacetabular", "Pubofemoral", "Ischiofemoral"],
  Knee: ["Tibiofemoral", "Patellofemoral"],
  Ankle: ["Tibiotalar", "Talocrural", "Subtalar"],
  Foot: [
    "Calcaneocuboid",
    "Talonavicular",
    "Cuneonavicular",
    "Intercuneiform",
    "Cuneocuboid",
    "Metatarsophalangeal",
    "Interphalangeal",
  ],
  Shoulder: [
    "Glenohumeral",
    "Acromioclavicular",
    "Sternoclavicular",
    "Scapulothoracic",
  ],
  Elbow: [
    "Radiocapitellar",
    "Ulnohumeral",
    "Proximal radioulnar",
    "Distal radioulnar",
  ],
  Wrist: [
    "Radiocarpal",
    "Midcarpal",
    "Carpometacarpal",
    "Intercarpal",
    "Intermetacarpal",
    "Metacarpophalangeal",
    "Interphalangeal",
  ],
  Hand: [
    " Carpometacarpal",
    "Intercarpal",
    "Intermetacarpal",
    "Metacarpophalangeal",
    "Interphalangeal",
  ],
};

export function JointOptions({
  area,
  onToggle,
  addedTargets,
}: JointOptionsProps) {
  const joints = jointMap[area] || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {joints.map((joint) => {
          const isAdded = addedTargets.includes(joint);

          return (
            <Card
              key={joint}
              isPressable // Always pressable to allow for toggling
              onPress={() => onToggle(joint)}
              className={`p-6 text-center transition-all duration-150 ${
                isAdded
                  ? "bg-primary-100 border-2 border-primary text-primary-600 font-semibold"
                  : "hover:bg-default-100 active:bg-primary-50"
              }`}
            >
              {joint}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
