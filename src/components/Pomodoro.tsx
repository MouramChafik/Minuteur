import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { PomodoroSession } from '../types';

interface PomodoroProps {
  theme: any;
  soundEnabled: boolean;
}

const Pomodoro: React.FC<PomodoroProps> = ({ theme, soundEnabled }) => {
  const [session, setSession] = useState<PomodoroSession>({
    id: Date.now().toString(),
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    currentSession: 1,
    isBreak: false,
    completedSessions: 0,
  });

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && soundEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  const playNotification = useCallback(() => {
    if (!soundEnabled) return;
    initAudioContext();
    if (!audioContextRef.current) return;

    // Different sounds for work/break transitions
    const frequencies = session.isBreak ? [400, 500, 600] : [600, 500, 400];
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.3);

        oscillator.start(audioContextRef.current!.currentTime);
        oscillator.stop(audioContextRef.current!.currentTime + 0.3);
      }, index * 200);
    });
  }, [initAudioContext, soundEnabled, session.isBreak]);

  const updateTimer = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        playNotification();
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
        
        // Auto-switch to next phase
        setTimeout(() => {
          setSession(currentSession => {
            const newSession = { ...currentSession };
            
            if (currentSession.isBreak) {
              // Break finished, start work
              newSession.isBreak = false;
              newSession.currentSession += 1;
              setTimeLeft(currentSession.workDuration * 60);
            } else {
              // Work finished, start break
              newSession.isBreak = true;
              newSession.completedSessions += 1;
              
              // Determine break type
              const isLongBreak = newSession.completedSessions % currentSession.sessionsUntilLongBreak === 0;
              const breakDuration = isLongBreak ? currentSession.longBreakDuration : currentSession.breakDuration;
              setTimeLeft(breakDuration * 60);
            }
            
            return newSession;
          });
          setIsRunning(false);
        }, 2000);
        
        return 0;
      }
      return prev - 1;
    });
  }, [playNotification]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
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
  }, [isRunning, timeLeft, updateTimer]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    initAudioContext();
  };

  const resetSession = () => {
    setIsRunning(false);
    setSession(prev => ({
      ...prev,
      currentSession: 1,
      isBreak: false,
      completedSessions: 0,
    }));
    setTimeLeft(session.workDuration * 60);
    setShowCelebration(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session.isBreak
    ? ((session.breakDuration * 60 - timeLeft) / (session.breakDuration * 60)) * 100
    : ((session.workDuration * 60 - timeLeft) / (session.workDuration * 60)) * 100;

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const currentPhase = session.isBreak ? 'Pause' : 'Travail';
  const nextBreakIsLong = session.completedSessions % session.sessionsUntilLongBreak === session.sessionsUntilLongBreak - 1;

  return (
    <div className="w-full max-w-md mx-auto">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">
              {session.isBreak ? '🍅' : '☕'}
            </div>
            <div className="text-3xl font-bold text-white mb-2 animate-pulse">
              {session.isBreak ? 'Pause terminée!' : 'Session terminée!'}
            </div>
            <div className="text-lg" style={{ color: theme.accent }}>
              {session.isBreak ? 'Retour au travail!' : 'Temps de pause!'}
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pomodoro</h1>
        <p style={{ color: theme.accent }}>
          Session {session.currentSession} • {session.completedSessions} terminées
        </p>
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
              stroke={session.isBreak ? '#22c55e' : theme.primary}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {session.isBreak ? (
                  <Coffee className="w-5 h-5" style={{ color: theme.accent }} />
                ) : (
                  <Brain className="w-5 h-5" style={{ color: theme.accent }} />
                )}
                <span style={{ color: theme.accent }} className="text-lg font-medium">
                  {currentPhase}
                </span>
              </div>
              <div className="text-white/60 text-sm">
                {isRunning ? 'En cours...' : 'En pause'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: isRunning ? '#f97316' : theme.primary,
            }}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={resetSession}
            className="w-16 h-16 rounded-full bg-slate-600 hover:bg-slate-700 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {session.completedSessions}
            </div>
            <div className="text-white/60 text-sm">Sessions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-2xl font-bold" style={{ color: theme.accent }}>
              {session.isBreak ? (
                nextBreakIsLong ? 'Longue' : 'Courte'
              ) : (
                nextBreakIsLong ? 'Longue' : 'Courte'
              )}
            </div>
            <div className="text-white/60 text-sm">Prochaine pause</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80">Progression de la session</span>
          <span style={{ color: theme.accent }} className="font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              backgroundColor: session.isBreak ? '#22c55e' : theme.primary,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;