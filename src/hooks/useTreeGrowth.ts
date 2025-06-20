
import { useState, useEffect } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf } from '../types/tree';

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
      lastReflectionDate: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('crowdskin-tree-growth', JSON.stringify(growthState));
  }, [growthState]);

  const addReflection = (reflection: Reflection) => {
    const newLeaf: TreeLeaf = {
      id: `leaf-${Date.now()}`,
      reflection,
      shape: reflection.shape,
      color: reflection.color,
      position: {
        x: 50 + (Math.random() - 0.5) * 60,
        y: 20 + Math.random() * 40
      },
      growthDay: growthState.totalReflections + 1
    };

    setGrowthState(prev => ({
      ...prev,
      totalReflections: prev.totalReflections + 1,
      leaves: [...prev.leaves, newLeaf],
      moodTone: getMoodTone(reflection.mood),
      hasFlowers: prev.totalReflections + 1 >= 30,
      hasBird: prev.totalReflections + 1 >= 50,
      hasLanterns: prev.totalReflections + 1 >= 100,
      lastReflectionDate: reflection.date
    }));

    // Play gentle growth sound (if audio context available)
    playGrowthSound();
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

  const playGrowthSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silent fallback if audio context is not available
    }
  };

  const addWhisper = (whisperText: string) => {
    // Whispers become soil particles - they nourish but don't create leaves
    setGrowthState(prev => ({
      ...prev,
      moodTone: 'sage' // Whispers bring calm
    }));
  };

  return {
    growthState,
    addReflection,
    addWhisper
  };
};
