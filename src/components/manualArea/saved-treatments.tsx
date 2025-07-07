import { SoftTissueTreatmentCard } from "./SoftTissueTreatmentCard";
import { JointMobilizationTreatmentCard } from "./JointMobilizationTreatmentCard";
import type { Treatment, TreatmentType } from "@/types/treatment";

interface SavedTreatmentsProps {
  type: TreatmentType;
  manual: Treatment[];
  // The setManual prop is not needed here, so we remove it to fix the warning.
  setManual?: (manual: any) => void; // Keeping it optional to prevent crashes if still passed
}

export function SavedTreatments({ type, manual }: SavedTreatmentsProps) {
  const filtered = manual.filter((t) => t.type === type);

  if (filtered.length === 0) {
    return (
      <div className=" text-center text-gray-500 ">Click to add treatment</div>
    );
  }

  return (
    <div className="gap-1 grid grid-cols-1 sm:grid-cols-2">
      {filtered.map((treatment: Treatment) => {
        switch (treatment.type) {
          case "soft-tissue":
          case "dry-needling":
            return (
              <SoftTissueTreatmentCard
                key={treatment.id}
                treatment={treatment}
              />
            );
          case "joint-mobilization":
            return (
              <JointMobilizationTreatmentCard
                key={treatment.id}
                treatment={treatment}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
