import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { TimerState } from '../types';

interface TimerProps {
  theme: any;
  soundEnabled: boolean;
}

const Timer: React.FC<TimerProps> = ({ theme, soundEnabled }) => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 5,
    seconds: 0,
    totalSeconds: 300,
    isRunning: false,
    isFinished: false,
  });

  const [initialTime, setInitialTime] = useState(300);
  const [inputMinutes, setInputMinutes] = useState(5);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && soundEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  const playBeep = useCallback((frequency: number = 800, duration: number = 200) => {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, [initAudioContext, soundEnabled]);

  const playVictoryMelody = useCallback(() => {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContextRef.current) return;

    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.2 },
      { freq: 783.99, time: 0.4 },
      { freq: 1046.5, time: 0.6 },
      { freq: 1046.5, time: 0.8 },
    ];

    notes.forEach(({ freq, time }) => {
      const oscillator = audioContextRef.current!.createOscillator();
      const gainNode = audioContextRef.current!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';

      const startTime = audioContextRef.current!.currentTime + time;
      const duration = time === 0.8 ? 0.4 : 0.15;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }, [initAudioContext, soundEnabled]);

  const updateTimer = useCallback(() => {
    setTimer(prev => {
      if (prev.totalSeconds <= 1) {
        setShowCelebration(true);
        playVictoryMelody();
        setTimeout(() => setShowCelebration(false), 3000);
        return {
          ...prev,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isRunning: false,
          isFinished: true,
        };
      }

      const newTotal = prev.totalSeconds - 1;
      const newMinutes = Math.floor(newTotal / 60);
      const newSeconds = newTotal % 60;

      if (newTotal <= 5) {
        playBeep(600, 100);
      }

      return {
        ...prev,
        minutes: newMinutes,
        seconds: newSeconds,
        totalSeconds: newTotal,
      };
    });
  }, [playBeep, playVictoryMelody]);

  useEffect(() => {
    if (timer.isRunning && timer.totalSeconds > 0) {
      intervalRef.current = window.setInterval(updateTimer, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.totalSeconds, updateTimer]);

  const setTime = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds;
    setTimer({
      minutes,
      seconds: 0,
      totalSeconds,
      isRunning: false,
      isFinished: false,
    });
    setInitialTime(totalSeconds);
    setInputMinutes(minutes);
    setInputSeconds(seconds);
  };

  const toggleTimer = () => {
    if (timer.isFinished) {
      reset();
      return;
    }
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
    initAudioContext();
  };

  const reset = () => {
    setTimer({
      minutes: Math.floor(initialTime / 60),
      seconds: initialTime % 60,
      totalSeconds: initialTime,
      isRunning: false,
      isFinished: false,
    });
    setShowCelebration(false);
  };

  const adjustMinutes = (delta: number) => {
    const newMinutes = Math.max(0, Math.min(59, inputMinutes + delta));
    setInputMinutes(newMinutes);
    setTime(newMinutes, inputSeconds);
  };

  const adjustSeconds = (delta: number) => {
    let newSeconds = inputSeconds + delta;
    let newMinutes = inputMinutes;
    
    if (newSeconds >= 60) {
      newSeconds = 0;
      newMinutes = Math.min(59, newMinutes + 1);
    } else if (newSeconds < 0) {
      newSeconds = 59;
      newMinutes = Math.max(0, newMinutes - 1);
    }
    
    if (newMinutes === 0 && newSeconds === 0) {
      newSeconds = 1;
    }
    
    setInputMinutes(newMinutes);
    setInputSeconds(newSeconds);
    
    const totalSeconds = newMinutes * 60 + newSeconds;
    setTimer({
      minutes: newMinutes,
      seconds: newSeconds,
      totalSeconds,
      isRunning: false,
      isFinished: false,
    });
    setInitialTime(totalSeconds);
  };

  const progress = initialTime > 0 ? ((initialTime - timer.totalSeconds) / initialTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getCircleColor = () => {
    if (timer.totalSeconds <= 5) {
      return '#ef4444';
    } else if (progress < 50) {
      return '#ffffff';
    } else if (progress < 90) {
      return '#22c55e';
    } else {
      return '#ef4444';
    }
  };

  const getProgressBarColor = () => {
    if (timer.totalSeconds <= 5) {
      return 'from-red-500 to-red-600';
    } else if (progress < 50) {
      return 'from-white to-gray-200';
    } else if (progress < 90) {
      return 'from-green-500 to-green-600';
    } else {
      return 'from-red-500 to-red-600';
    }
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const quickTimes = [
    { label: '30s', minutes: 0, seconds: 30 },
    { label: '1m', minutes: 1, seconds: 0 },
    { label: '2m', minutes: 2, seconds: 0 },
    { label: '5m', minutes: 5, seconds: 0 },
    { label: '10m', minutes: 10, seconds: 0 },
    { label: '15m', minutes: 15, seconds: 0 },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-white mb-2 animate-pulse">Temps écoulé!</div>
            <div className="text-xl" style={{ color: theme.accent }}>Votre réponse,</div>
            <div className="text-xl" style={{ color: theme.accent }}>s'il vous plaît.</div>
          </div>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  backgroundColor: theme.accent,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Minuteur</h1>
        <p style={{ color: theme.accent }}>Minuteur personnalisable avec effets sonores</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-6">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={getCircleColor()}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
              style={{
                filter: timer.totalSeconds <= 5 ? 'drop-shadow(0 0 10px #ef4444)' : 'none',
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div 
                className={`text-6xl font-mono font-bold transition-all duration-300 ${
                  timer.totalSeconds <= 5 ? 'animate-pulse text-red-400' : 'text-white'
                }`}
              >
                {formatTime(timer.minutes, timer.seconds)}
              </div>
              <div style={{ color: theme.accent }} className="text-sm mt-2">
                {timer.isRunning ? 'En cours...' : timer.isFinished ? 'Terminé!' : 'Prêt'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: timer.isRunning ? '#f97316' : timer.isFinished ? '#22c55e' : theme.primary,
            }}
          >
            {timer.isRunning ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={reset}
            className="w-16 h-16 rounded-full bg-slate-600 hover:bg-slate-700 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        {!timer.isRunning && !timer.isFinished && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <button
                onClick={() => adjustMinutes(-1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-lg font-medium min-w-[90px]">
                {inputMinutes} min
              </span>
              <button
                onClick={() => adjustMinutes(1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => adjustSeconds(-1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-lg font-medium min-w-[90px]">
                {inputSeconds} sec
              </span>
              <button
                onClick={() => adjustSeconds(1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickTimes.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setTime(time.minutes, time.seconds)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    inputMinutes === time.minutes && inputSeconds === time.seconds
                      ? 'text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  style={{
                    backgroundColor: inputMinutes === time.minutes && inputSeconds === time.seconds ? theme.primary : undefined,
                    color: inputMinutes === time.minutes && inputSeconds === time.seconds ? 'white' : theme.accent,
                  }}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getProgressBarColor()} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;