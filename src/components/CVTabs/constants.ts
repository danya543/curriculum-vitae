import type { MasteryLevel } from "@/types/types";

export const masteryToProgress: Record<MasteryLevel, number> = {
    Novice: 20,
    Advanced: 40,
    Competent: 60,
    Proficient: 80,
    Expert: 100,
};

export const masteryToColor: Record<MasteryLevel, string> = {
    Novice: "#d3d3d3",
    Advanced: "#00bcd4",
    Competent: "#4caf50",
    Proficient: "#ffeb3b",
    Expert: "#f44336",
};

export const Mastery = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'] as const;