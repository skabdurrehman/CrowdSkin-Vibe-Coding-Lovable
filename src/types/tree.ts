
export interface Reflection {
  id: string;
  date: string;
  mood: string;
  shape: string;
  color: string;
  intensity: number;
  notes?: string;
  whisperText?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  emotionalLore?: string;
  direction?: 'outward' | 'inward' | 'still' | 'rising';
}

export interface TreeLeaf {
  id: string;
  reflection: Reflection;
  shape: string;
  color: string;
  position: { x: number; y: number; depth?: number };
  growthDay: number;
  isGlowing?: boolean;
  depth?: number;
}

export interface QuietThought {
  id: string;
  text: string;
  date: string;
  hasGrown: boolean;
}

export interface TreeGrowthState {
  totalReflections: number;
  leaves: TreeLeaf[];
  moodTone: string;
  hasFlowers: boolean;
  hasBird: boolean;
  hasLanterns: boolean;
  lastReflectionDate: string;
  quietThoughts: QuietThought[];
  emotionalPattern: string[];
  preferredReflectionTime?: 'morning' | 'afternoon' | 'evening' | 'night';
  isQuietBloomMode: boolean;
  mushroomCount: number;
  branchCount?: number;
  canopyRadius?: number;
  twilightMode?: boolean;
}

export interface EmotionalTrend {
  dominantMood: string;
  moodStreak: number;
  lastSoftDay?: string;
  needsGentleReminder: boolean;
}

export interface SeasonalEffects {
  hasWind: boolean;
  hasBirds: boolean;
  hasBlossoms: boolean;
  hasTwilightGlow: boolean;
  currentSeason: 'seedling' | 'growing' | 'blooming' | 'mature';
}
