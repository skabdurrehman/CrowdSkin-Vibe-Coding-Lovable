import { useState, useEffect } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf, QuietThought, EmotionalTrend } from '../types/tree';

export const useTreeGrowth = () => {
  const [growthState, setGrowthState] = useState<TreeGrowthState>(() => {
    const saved = localStorage.getItem('crowdskin-tree-growth');
    const defaultState = {
      totalReflections: 0,
      leaves: [],
      moodTone: 'sage',
      hasFlowers: false,
      hasBird: false,
      hasLanterns: false,
      lastReflectionDate: '',
      quietThoughts: [],
      emotionalPattern: [],
      isQuietBloomMode: false,
      mushroomCount: 0,
      branchCount: 1,
      canopyRadius: 25,
      twilightMode: false
    };
    
    if (saved) {
      const parsedState = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsedState,
        emotionalPattern: Array.isArray(parsedState.emotionalPattern) ? parsedState.emotionalPattern : []
      };
    }
    
    return defaultState;
  });

  const [isGrowing, setIsGrowing] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [currentTrend, setCurrentTrend] = useState<EmotionalTrend | null>(null);
  const [leafMorphing, setLeafMorphing] = useState(false);

  useEffect(() => {
    localStorage.setItem('crowdskin-tree-growth', JSON.stringify(growthState));
    analyzeEmotionalTrend();
  }, [growthState]);

  const analyzeEmotionalTrend = () => {
    if (growthState.leaves.length < 3) return;

    const recentLeaves = growthState.leaves.slice(-7); // Last week
    const moodCounts: { [key: string]: number } = {};
    
    recentLeaves.forEach(leaf => {
      moodCounts[leaf.reflection.mood] = (moodCounts[leaf.reflection.mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    // Check for concerning patterns
    const sharpMoods = ['anxious', 'overwhelmed', 'frustrated', 'heavy'];
    const recentSharpDays = recentLeaves.filter(leaf => 
      sharpMoods.includes(leaf.reflection.mood)
    ).length;

    const lastSoftDay = [...growthState.leaves]
      .reverse()
      .find(leaf => ['peaceful', 'gentle', 'hopeful'].includes(leaf.reflection.mood))
      ?.reflection.date;

    setCurrentTrend({
      dominantMood,
      moodStreak: recentSharpDays,
      lastSoftDay,
      needsGentleReminder: recentSharpDays >= 3
    });
  };

  const detectPreferredTime = (reflection: Reflection) => {
    const hour = new Date(reflection.date).getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    return timeOfDay;
  };

  const generateIntelligentLeafPosition = (leafCount: number, mood: string) => {
    // Smart canopy logic for natural tree growth
    const totalLeaves = leafCount + 1;
    const branchCount = Math.floor(totalLeaves / 30) + 2; // New branch every 30 leaves
    
    // Expand canopy width as tree grows
    const baseRadius = 25;
    const expansionFactor = Math.min(totalLeaves / 50, 2); // Max 2x expansion
    const canopyRadius = baseRadius + (expansionFactor * 15);
    
    // Mood-based clustering
    const moodClusters = {
      peaceful: { angle: 0, radius: 0.7 },
      hopeful: { angle: 45, radius: 0.8 },
      gentle: { angle: 90, radius: 0.6 },
      anxious: { angle: 180, radius: 0.9 },
      frustrated: { angle: 225, radius: 0.85 },
      heavy: { angle: 270, radius: 0.75 },
      overwhelmed: { angle: 315, radius: 0.95 },
      disconnected: { angle: 135, radius: 0.8 }
    };
    
    const cluster = moodClusters[mood as keyof typeof moodClusters] || { angle: Math.random() * 360, radius: 0.8 };
    
    // Calculate position within natural canopy bounds
    const branchIndex = leafCount % branchCount;
    const leafOnBranch = Math.floor(leafCount / branchCount);
    
    // Add some randomness to prevent rigid patterns
    const angleVariation = (Math.random() - 0.5) * 60; // ±30 degrees
    const radiusVariation = (Math.random() - 0.5) * 0.3; // ±15% radius
    
    const finalAngle = (cluster.angle + angleVariation + (branchIndex * (360 / branchCount))) % 360;
    const finalRadius = canopyRadius * (cluster.radius + radiusVariation) * (0.4 + (leafOnBranch * 0.1));
    
    // Convert to cartesian coordinates, ensuring leaves stay in canopy
    const x = 50 + Math.cos(finalAngle * Math.PI / 180) * finalRadius;
    const y = Math.max(15, Math.min(60, 35 - Math.sin(finalAngle * Math.PI / 180) * finalRadius * 0.6));
    
    return {
      x: Math.max(15, Math.min(85, x)),
      y: Math.max(15, Math.min(65, y)),
      depth: Math.random() * 10 // For layering effect
    };
  };

  const addReflection = (reflection: Reflection) => {
    setIsGrowing(true);
    setLeafMorphing(true);
    
    const timeOfDay = detectPreferredTime(reflection);
    const enhancedReflection = { ...reflection, timeOfDay };
    
    const position = generateIntelligentLeafPosition(growthState.totalReflections, reflection.mood);
    
    const newLeaf: TreeLeaf = {
      id: `leaf-${Date.now()}`,
      reflection: enhancedReflection,
      shape: reflection.shape,
      color: reflection.color,
      position,
      growthDay: growthState.totalReflections + 1,
      isGlowing: reflection.intensity >= 8,
      depth: position.depth
    };

    // Smooth morph transition
    setTimeout(() => {
      setLeafMorphing(false);
      
      setTimeout(() => {
        setGrowthState(prev => {
          const newTotal = prev.totalReflections + 1;
          const newPattern = [...prev.emotionalPattern, reflection.mood].slice(-10);
          const newBranchCount = Math.floor(newTotal / 30) + 2;
          const newCanopyRadius = 25 + Math.min(newTotal / 50, 2) * 15;
          
          return {
            ...prev,
            totalReflections: newTotal,
            leaves: [...prev.leaves, newLeaf].sort((a, b) => (b.depth || 0) - (a.depth || 0)), // Sort by depth for layering
            moodTone: getMoodTone(reflection.mood),
            hasFlowers: newTotal >= 50,
            hasBird: newTotal >= 50,
            hasLanterns: newTotal >= 100,
            branchCount: newBranchCount,
            canopyRadius: newCanopyRadius,
            twilightMode: newTotal >= 150,
            lastReflectionDate: reflection.date,
            emotionalPattern: newPattern
          };
        });
        
        playGrowthSound(reflection.mood, timeOfDay);
        setIsGrowing(false);
      }, 1000);
    }, 1500);
  };

  const addQuietThought = (thoughtText: string) => {
    const newThought: QuietThought = {
      id: `thought-${Date.now()}`,
      text: thoughtText,
      date: new Date().toISOString(),
      hasGrown: false
    };

    setGrowthState(prev => ({
      ...prev,
      quietThoughts: [...prev.quietThoughts, newThought]
    }));

    // After some time, grow a mushroom
    setTimeout(() => {
      setGrowthState(prev => ({
        ...prev,
        mushroomCount: prev.mushroomCount + 1,
        quietThoughts: prev.quietThoughts.map(t => 
          t.id === newThought.id ? { ...t, hasGrown: true } : t
        )
      }));
    }, 3000);

    playRootSound();
  };

  const getSeasonalEffects = () => {
    const { totalReflections } = growthState;
    
    return {
      hasWind: totalReflections >= 50,
      hasBirds: totalReflections >= 50,
      hasBlossoms: totalReflections >= 100,
      hasTwilightGlow: totalReflections >= 150,
      currentSeason: totalReflections < 30 ? 'seedling' : 
                   totalReflections < 100 ? 'growing' :
                   totalReflections < 150 ? 'blooming' : 'mature'
    };
  };

  const getMoodTone = (mood: string): string => {
    const moodToTone = {
      peaceful: 'sage',
      anxious: 'yellow',
      heavy: 'gray',
      disconnected: 'blue',
      overwhelmed: 'red',
      hopeful: 'green',
      frustrated: 'orange',
      gentle: 'lavender'
    };
    return moodToTone[mood as keyof typeof moodToTone] || 'sage';
  };

  const playGrowthSound = (mood: string, timeOfDay: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different tones based on mood and time
      const moodFrequencies = {
        peaceful: 220,
        anxious: 180,
        heavy: 140,
        disconnected: 160,
        overwhelmed: 120,
        hopeful: 330,
        frustrated: 200,
        gentle: 280
      };
      
      const timeModifier = {
        morning: 1.2,
        afternoon: 1.0,
        evening: 0.9,
        night: 0.7
      };
      
      const baseFreq = moodFrequencies[mood as keyof typeof moodFrequencies] || 220;
      const finalFreq = baseFreq * (timeModifier[timeOfDay as keyof typeof timeModifier] || 1.0);
      
      oscillator.frequency.setValueAtTime(finalFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(finalFreq * 1.5, audioContext.currentTime + 0.8);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const playRootSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 2);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const toggleQuietBloom = () => {
    setGrowthState(prev => ({
      ...prev,
      isQuietBloomMode: !prev.isQuietBloomMode
    }));
  };

  const addWhisper = (whisperText: string) => {
    setGrowthState(prev => ({
      ...prev,
      moodTone: 'sage'
    }));
    
    playRootSound();
  };

  const toggleSilentMode = () => {
    setSilentMode(!silentMode);
  };

  return {
    growthState,
    addReflection,
    addWhisper,
    addQuietThought,
    isGrowing,
    leafMorphing,
    silentMode,
    toggleSilentMode,
    toggleQuietBloom,
    currentTrend,
    getSeasonalEffects
  };
};
