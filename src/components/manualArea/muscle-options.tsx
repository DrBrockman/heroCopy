import { Card } from "@heroui/react";

interface MuscleOptionsProps {
  area: string;
  onToggle: (muscle: string) => void;
  addedTargets: string[];
}

const muscleMap: Record<string, string[]> = {
  "Cervical & Shoulder": [
    "Cervical paraspinals",
    "Splenius capitis",
    "Splenius cervicis",
    "Levator scapulae",
    "Upper trapezius",
    "Middle trapezius",
    "Lower trapezius",
    "Rhomboids",
    "Deltoid",
    "Supraspinatus",
    "Infraspinatus",
    "Teres minor",
    "Teres major",
    "Subscapularis",
  ],
  UE: [
    "Bicep",
    "Tricep",
    "Extensor Mass Forearm",
    "Flexor Mass Forearm",
    "Finger Flexors",
    "Finger Extensors",
  ],
  "Anterior Torso": ["Pec Major", "Pec Minor"],
  "Posterior Torso": [
    "Thoracic paraspinals",
    "Latissimus Dorsi",
    "Erector Spinae",
    "Quadratus Lumborum",
  ],
  Lumbopelvic: [
    "Gluteus Medius",
    "Gluteus Minimus",
    "Gluteus Maximus",
    "Piriformis",
    "Quadratus Femoris",
    "Psoas",
    "Iliacus",
  ],
  LE: [
    "Rectus Femoris",
    "Vastus Lateralis",
    "Vastus Medialis",
    "Vastus Intermedius",
    "Sartorius",
    "Gracilis",
    "Adductor Longus",
    "Adductor Brevis",
    "Adductor Magnus",
    "Pectineus",
  ],
  Ankle: [
    "Gastrocnemius",
    "Soleus",
    "Tibialis Anterior",
    "Tibialis Posterior",
    "Peroneus Longus",
    "Peroneus Brevis",
  ],
};

export function MuscleOptions({
  area,
  onToggle,
  addedTargets,
}: MuscleOptionsProps) {
  const muscles = muscleMap[area] || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {muscles.map((muscle) => {
          const isAdded = addedTargets.includes(muscle);

          return (
            <Card
              key={muscle}
              isPressable // Always pressable to allow for toggling
              onPress={() => onToggle(muscle)}
              className={`p-6 text-center transition-all duration-150 ${
                isAdded
                  ? "bg-primary-100 border-2 border-primary text-primary-600 font-semibold"
                  : "hover:bg-default-100 active:bg-primary-50"
              }`}
            >
              {muscle}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
