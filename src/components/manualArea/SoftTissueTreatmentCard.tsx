import { Card } from "@heroui/react";
import type {
  SoftTissueTreatment,
  DryNeedlingTreatment,
} from "@/types/treatment";

interface SoftTissueTreatmentCardProps {
  treatment: SoftTissueTreatment | DryNeedlingTreatment;
}

const SOFT_TISSUE_LABELS: Record<string, string> = {
  cupping: "Cupping",
  theragun: "Theragun",
  strumming: "Strumming",
  sustained: "Sustained",
};

const DRY_NEEDLING_LABELS: Record<string, string> = {
  hzStimulation: "2 Hz stimulation",
  localTwitch: "Local Twitch Response",
  reproducePain: "Reproduction of Patient's pain",
};

export function SoftTissueTreatmentCard({
  treatment,
}: SoftTissueTreatmentCardProps) {
  // Get selected options and map to labels
  const selectedOptions =
    treatment.type === "soft-tissue"
      ? Object.entries(treatment.options)
          .filter(([_, v]) => v)
          .map(([k]) => SOFT_TISSUE_LABELS[k] || k)
      : Object.entries(treatment.options)
          .filter(([_, v]) => v)
          .map(([k]) => DRY_NEEDLING_LABELS[k] || k);

  return (
    <Card className="p-1 mt-2 sm:p-2">
      <div className="inline-flex flex-row gap-1">
        <div className="text-xs font-medium  sm:text-md">
          {treatment.target}
        </div>
        {selectedOptions.length > 0 && (
          <div className="text-xs text-primary-700 font-medium truncate sm:text-md">
            {selectedOptions.join(", ")}
          </div>
        )}
      </div>
    </Card>
  );
}
