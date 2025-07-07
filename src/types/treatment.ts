export type TreatmentType =
  | "soft-tissue"
  | "joint-mobilization"
  | "dry-needling";

// Define the specific options for each treatment type
export interface SoftTissueOptions {
  cupping: boolean;
  theragun: boolean;
  strumming: boolean;
  sustained: boolean;
}

export interface JointMobilizationOptions {
  gradeI: boolean;
  gradeII: boolean;
  gradeIII: boolean;
  gradeIV: boolean;
  thrust: boolean;
}

// For Dry Needling, use new options
export interface DryNeedlingOptions {
  hzStimulation: boolean; // "w/ 2 hz stimulation"
  localTwitch: boolean; // "local twitch response"
  reproducePain: boolean; // "reproduction of patients pain"
}

// Base interface that all treatments will share
interface BaseTreatment {
  id: string;
  area: string; // e.g., "Shoulder"
  target: string; // A generic name for the muscle, joint, etc.
}

// Create specific treatment types using a "discriminated union"
// This lets TypeScript know which options belong to which type
export interface SoftTissueTreatment extends BaseTreatment {
  type: "soft-tissue";
  options: SoftTissueOptions;
}

export interface DryNeedlingTreatment extends BaseTreatment {
  type: "dry-needling";
  options: DryNeedlingOptions;
}

export interface JointMobilizationTreatment extends BaseTreatment {
  type: "joint-mobilization";
  options: JointMobilizationOptions;
}

// The final Treatment type is a union of all possible treatment types
export type Treatment =
  | SoftTissueTreatment
  | JointMobilizationTreatment
  | DryNeedlingTreatment;
