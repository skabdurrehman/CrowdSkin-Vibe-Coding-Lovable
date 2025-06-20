
export interface Reflection {
  id: string;
  date: string;
  mood: string;
  shape: string;
  color: string;
  intensity: number;
  notes?: string;
  whisperText?: string;
}

export interface TreeLeaf {
  id: string;
  reflection: Reflection;
  shape: string;
  color: string;
  position: { x: number; y: number };
  growthDay: number;
}

export interface TreeGrowthState {
  totalReflections: number;
  leaves: TreeLeaf[];
  moodTone: string;
  hasFlowers: boolean;
  hasBird: boolean;
  hasLanterns: boolean;
  lastReflectionDate: string;
}
