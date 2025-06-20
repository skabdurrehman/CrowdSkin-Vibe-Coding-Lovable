
import { useState, useEffect } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf, QuietThought, EmotionalTrend } from '../types/tree';

export const useTreeGrowth = () => {
  const [growthState, setGrowthState] = useState<TreeGrowthState>(() => {
    const saved = localStorage.getItem('crowdskin-tree-growth');
    return saved ? JSON.parse(saved) : {
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
      mushroomCount: 0
    };
  });

  const [isGrowing, setIsGrowing] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [currentTrend, setCurrentTrend] = useState<EmotionalTrend | null>(null);

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

  const addReflection = (reflection: Reflection) => {
    setIsGrowing(true);
    
    const timeOfDay = detectPreferredTime(reflection);
    const enhancedReflection = { ...reflection, timeOfDay };
    
    const newLeaf: TreeLeaf = {
      id: `leaf-${Date.now()}`,
      reflection: enhancedReflection,
      shape: reflection.shape,
      color: reflection.color,
      position: generateLeafPosition(growthState.totalReflections),
      growthDay: growthState.totalReflections + 1,
      isGlowing: reflection.intensity >= 8 // High intensity reflections glow
    };

    // Animate the growth process with gentle music
    setTimeout(() => {
      setGrowthState(prev => {
        const newTotal = prev.totalReflections + 1;
        const newPattern = [...prev.emotionalPattern, reflection.mood].slice(-10);
        
        // Update preferred reflection time
        const timePreferences = prev.leaves
          .map(l => l.reflection.timeOfDay)
          .filter(Boolean);
        timePreferences.push(timeOfDay);
        
        const timeCounts: { [key: string]: number } = {};
        timePreferences.forEach(time => {
          if (time) timeCounts[time] = (timeCounts[time] || 0) + 1;
        });
        
        const preferredTime = Object.keys(timeCounts).reduce((a, b) => 
          timeCounts[a] > timeCounts[b] ? a : b
        ) as 'morning' | 'afternoon' | 'evening' | 'night';

        return {
          ...prev,
          totalReflections: newTotal,
          leaves: [...prev.leaves, newLeaf],
          moodTone: getMoodTone(reflection.mood),
          hasFlowers: newTotal >= 30,
          hasBird: newTotal >= 50,
          hasLanterns: newTotal >= 100,
          lastReflectionDate: reflection.date,
          emotionalPattern: newPattern,
          preferredReflectionTime: preferredTime
        };
      });
      
      playGrowthSound(reflection.mood, timeOfDay);
      setIsGrowing(false);
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

  const generateLeafPosition = (leafCount: number) => {
    const branchCount = Math.floor(leafCount / 8) + 1;
    const leafOnBranch = leafCount % 8;
    const branchAngle = (360 / Math.max(branchCount, 3)) * (leafCount % branchCount);
    
    const radius = 25 + (leafOnBranch * 6);
    const x = 50 + Math.cos(branchAngle * Math.PI / 180) * radius;
    const y = 35 + Math.sin(branchAngle * Math.PI / 180) * radius * 0.8;
    
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(75, y))
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
    silentMode,
    toggleSilentMode,
    toggleQuietBloom,
    currentTrend
  };
};
