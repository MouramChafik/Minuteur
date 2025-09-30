import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Eye, Pause, Play, Music, VolumeX } from "lucide-react";
import rainSound from "../../dist/assets/rain.mp3";
import forestSound from "../../dist/assets/forest.mp3";
import oceanSound from "../../dist/assets/ocean.mp3";
import pianoSound from "../../dist/assets/Piano.mp3";
import focusPicture from "../../images/focus.avif";

interface FocusModeProps {
  theme: any;
}

const FocusMode: React.FC<FocusModeProps> = ({ theme }) => {
  // Format mm:ss
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  const [isPlaying, setIsPlaying] = useLocalStorage<boolean>(
    "focusPlayerPlaying",
    true
  );
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioTime, setAudioTime] = useState({ current: 0, duration: 0 });
  const [isActive, setIsActive] = useLocalStorage<boolean>(
    "focusModeActive",
    false
  );
  const [ambientSound, setAmbientSound] = useLocalStorage<string>(
    "focusPlayerAmbientSound",
    "none"
  );
  const [volume, setVolume] = useLocalStorage<number>("focusPlayerVolume", 50);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [audioError, setAudioError] = useState<string | null>(null);

  const ambientSounds = [
    { id: "none", name: "Aucun", url: "" },
    { id: "rain", name: "Pluie", url: rainSound },
    { id: "forest", name: "Forêt", url: forestSound },
    { id: "ocean", name: "Océan", url: oceanSound },
    { id: "Piano", name: "Piano", url: pianoSound },
  ];

  useEffect(() => {
  // Cleanup function pour arrêter l'audio précédent
  return () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = ''; // Important: libère la ressource
    }
  };
}, [isActive, ambientSound, volume, audioElement]); // Ajoutez audioElement dans les dépendances

useEffect(() => {
  if (!isActive) {
    // Arrêter l'audio si le mode focus est désactivé
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
      setIsPlaying(false);
      setAudioProgress(0);
    }
    return;
  }

  if (ambientSound === "none") {
    // Arrêter l'audio si "Aucun" est sélectionné
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    setIsPlaying(false);
    setAudioProgress(0);
    return;
  }

  // Créer un nouvel audio seulement si nécessaire
  const sound = ambientSounds.find((s) => s.id === ambientSound);
  if (sound && sound.url) {
    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = volume / 100;
    
    audio.onerror = () => {
      setAudioError("Choisissez un son, s’il vous plaît, ou rafraîchissez la page en cas d’erreur.");
    };
    
    audio.play()
      .then(() => {
        setAudioError(null);
        setIsPlaying(true);
      })
      .catch(() => {
        setAudioError("Choisissez un son, s’il vous plaît.");
        setIsPlaying(false);
      });
    
    audio.ontimeupdate = () => {
      if (audio.duration > 0) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setAudioTime({
          current: audio.currentTime,
          duration: audio.duration,
        });
      }
    };
    
    setAudioElement(audio);
  }
}, [isActive, ambientSound, volume]);


  // const createWhiteNoise = () => {
  //   const audioContext = new (window.AudioContext ||
  //     (window as any).webkitAudioContext)();
  //   const bufferSize = 4096;
  //   const whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);

  //   whiteNoise.onaudioprocess = (e) => {
  //     const output = e.outputBuffer.getChannelData(0);
  //     for (let i = 0; i < bufferSize; i++) {
  //       output[i] = Math.random() * 2 - 1;
  //     }
  //   };

  //   const gainNode = audioContext.createGain();
  //   gainNode.gain.value = (volume / 100) * 0.1; // Lower volume for white noise

  //   whiteNoise.connect(gainNode);
  //   gainNode.connect(audioContext.destination);
  // };

  const toggleFocusMode = () => {
    setIsActive(!isActive);
  };

  const quotes = [
    "Fermez les yeux et respirez profondément.",
    "La concentration est la clé de la force mentale.",
    "Un esprit concentré est un esprit puissant.",
    "La distraction est l'ennemi de la profondeur.",
    "Focus sur ce qui compte vraiment.",
    "La qualité de votre attention détermine la qualité de votre expérience.",
    "Dans le calme, trouvez votre force.",
    "Chaque moment de concentration est un pas vers l'excellence.",
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

   useEffect(() => {
      if (audioError) {
        const timer = setTimeout(() => {
          setAudioError(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
   }, [audioError]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {audioError && (
        <div className="bg-red-500 backdrop-blur-lg text-white rounded-xl p-3 mb-4 text-center animate-slideIn">
          {audioError}
        </div>
      )}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Mode Focus</h1>
        <p style={{ color: theme.accent }}>
          {isActive ? "Mode actif" : "Éliminez les distractions"}
        </p>
      </div>

      {!isActive ? (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="text-6xl mb-4">
              <img src={focusPicture} alt="Focus Mode" className="w-32 h-32 mx-auto mb-4 rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Prêt à vous concentrer ?
            </h2>
            <p className="text-white/80 mb-6">
              Le mode focus vous aide à rester concentré en bloquant les
              distractions et en créant un environnement sonore apaisant.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Son d'ambiance
                </label>
                <select
                  value={ambientSound}
                  onChange={(e) => setAmbientSound(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {ambientSounds.map((sound) => (
                    <option
                      key={sound.id}
                      value={sound.id}
                      className="bg-gray-800"
                    >
                      {sound.name}
                    </option>
                  ))}
                </select>
              </div>

              {ambientSound !== "none" && (
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Volume: {volume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <button
              onClick={toggleFocusMode}
              className="w-full py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              style={{ backgroundColor: theme.primary }}
            >
              <Eye className="w-5 h-5" />
              <span>Activer le mode focus</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Focus Mode Active */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Mode Focus Actif
            </h2>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-white/90 italic text-lg leading-relaxed">
                "{currentQuote}"
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              {ambientSound !== "none" && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5 text-white/60" />
                    <span className="text-white/80 text-sm">
                      {ambientSounds.find((s) => s.id === ambientSound)?.name}
                    </span>
                  </div>
                  {audioElement && (
                    <div className="w-full flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => {
                          if (isPlaying) {
                            audioElement.pause();
                            setIsPlaying(false);
                          } else {
                            audioElement.play();
                            setIsPlaying(true);
                          }
                        }}
                        className="bg-white/10 rounded-full p-2 text-white hover:bg-white/20"
                        title={isPlaying ? "Pause" : "Lecture"}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        onChange={(e) => {
                          if (audioElement && audioElement.duration > 0) {
                            audioElement.currentTime =
                              (Number(e.target.value) / 100) *
                              audioElement.duration;
                            setAudioProgress(Number(e.target.value));
                          }
                        }}
                        className="w-full"
                        style={{ accentColor: theme.primary }}
                      />
                      <span className="ml-2 text-xs text-white/70 min-w-[60px] ">
                        {audioTime.duration > 0
                          ? `${formatTime(
                              audioTime.duration - audioTime.current
                            )} restantes`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleFocusMode}
              className="w-full py-4 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <VolumeX className="w-5 h-5" />
              <span>Désactiver le mode focus</span>
            </button>
          </div>

          {/* Focus Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-medium mb-3">
              Conseils pour rester concentré
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <span>Éliminez les notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <span>Prenez des pauses régulières</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <span>Hydratez-vous</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <span>Respirez profondément</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode;
