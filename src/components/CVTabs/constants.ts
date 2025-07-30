import type { MasteryLevel } from "@/types/types";

export const masteryToProgress: Record<MasteryLevel, number> = {
    Novice: 20,
    Advanced: 40,
    Competent: 60,
    Proficient: 80,
    Expert: 100,
};
type MasteryColors = {
    progress: string;
    bg: string;
};
export const masteryToColor: Record<MasteryLevel, MasteryColors> = {
    Novice: { progress: "#767676", bg: '#3b3b3b' },
    Advanced: { progress: "#29b6f6", bg: '#145b7b' },
    Competent: { progress: "#66bb6a", bg: '#335d35' },
    Proficient: { progress: "#ffb800", bg: '#7f5c00' },
    Expert: { progress: "#c63031", bg: '#c63031' },
};

export const Mastery = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'] as const;