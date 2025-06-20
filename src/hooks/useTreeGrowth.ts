
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

  const [isGrowing, setIsGrowing] = useState(false);
  const [silentMode, setSilentMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('crowdskin-tree-growth', JSON.stringify(growthState));
  }, [growthState]);

  const addReflection = (reflection: Reflection) => {
    setIsGrowing(true);
    
    const newLeaf: TreeLeaf = {
      id: `leaf-${Date.now()}`,
      reflection,
      shape: reflection.shape,
      color: reflection.color,
      position: generateLeafPosition(growthState.totalReflections),
      growthDay: growthState.totalReflections + 1
    };

    // Animate the growth process
    setTimeout(() => {
      setGrowthState(prev => {
        const newTotal = prev.totalReflections + 1;
        return {
          ...prev,
          totalReflections: newTotal,
          leaves: [...prev.leaves, newLeaf],
          moodTone: getMoodTone(reflection.mood),
          hasFlowers: newTotal >= 30,
          hasBird: newTotal >= 50,
          hasLanterns: newTotal >= 100,
          lastReflectionDate: reflection.date
        };
      });
      
      playGrowthSound(reflection.mood);
      setIsGrowing(false);
    }, 1500);
  };

  const generateLeafPosition = (leafCount: number) => {
    const branchCount = Math.floor(leafCount / 8) + 1;
    const leafOnBranch = leafCount % 8;
    const branchAngle = (360 / Math.max(branchCount, 3)) * (leafCount % branchCount);
    
    const radius = 20 + (leafOnBranch * 5);
    const x = 50 + Math.cos(branchAngle * Math.PI / 180) * radius;
    const y = 30 + Math.sin(branchAngle * Math.PI / 180) * radius * 0.7;
    
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(80, y))
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

  const playGrowthSound = (mood: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different tones for different moods
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
      
      const baseFreq = moodFrequencies[mood as keyof typeof moodFrequencies] || 220;
      
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.8);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const addWhisper = (whisperText: string) => {
    // Whispers become soil particles - gentle animation
    setGrowthState(prev => ({
      ...prev,
      moodTone: 'sage'
    }));
    
    // Play gentle soil sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(60, audioContext.currentTime + 1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const toggleSilentMode = () => {
    setSilentMode(!silentMode);
  };

  return {
    growthState,
    addReflection,
    addWhisper,
    isGrowing,
    silentMode,
    toggleSilentMode
  };
};
