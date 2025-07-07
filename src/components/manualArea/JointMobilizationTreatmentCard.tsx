import { Card } from "@heroui/react";

import type { JointMobilizationTreatment } from "@/types/treatment";

interface JointMobilizationCardProps {
  treatment: JointMobilizationTreatment;
}

const JOINT_LABELS: Record<string, string> = {
  gradeI: "Grade I",
  gradeII: "Grade II",
  gradeIII: "Grade III",
  gradeIV: "Grade IV",
  thrust: "Thrust",
};

export function JointMobilizationTreatmentCard({
  treatment,
}: JointMobilizationCardProps) {
  // Get selected options and map to labels
  const selectedOptions = Object.entries(treatment.options)
    .filter(([_, v]) => v)
    .map(([k]) => JOINT_LABELS[k] || k);

  return (
    <Card className="p-1 mt-2 sm:p-2">
      <div className="inline-flex flex-row gap-1">
        <h3 className="text-xs font-medium truncate sm:text-md">
          {treatment.target}
        </h3>
        {selectedOptions.length > 0 && (
          <div className="text-xs text-primary-700 sm:text-md font-medium truncate">
            {selectedOptions.join(", ")}
          </div>
        )}
      </div>
    </Card>
  );
}
