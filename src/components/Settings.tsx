import React, { useState } from 'react';
import { Palette, Volume2, VolumeX, Image, Download, Upload, Trash2 } from 'lucide-react';
import { Theme, UserSettings } from '../types';
import { defaultThemes, backgroundImages } from '../data/themes';

interface SettingsProps {
  theme: Theme;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, settings, onSettingsChange }) => {
  const [activeSection, setActiveSection] = useState<'theme' | 'background' | 'audio' | 'data'>('theme');

  const updateSettings = (updates: Partial<UserSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const exportData = () => {
    const data = {
      settings,
      todos: JSON.parse(localStorage.getItem('todos') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) {
          onSettingsChange(data.settings);
        }
        if (data.todos) {
          localStorage.setItem('todos', JSON.stringify(data.todos));
        }
        if (data.notes) {
          localStorage.setItem('notes', JSON.stringify(data.notes));
        }
        
        alert('Données importées avec succès! Rechargez la page pour voir les changements.');
      } catch (error) {
        alert('Erreur lors de l\'importation des données.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) {
      localStorage.clear();
      alert('Toutes les données ont été supprimées. Rechargez la page.');
    }
  };

  const sections = [
    { id: 'theme', name: 'Thème', icon: Palette },
    { id: 'background', name: 'Arrière-plan', icon: Image },
    { id: 'audio', name: 'Audio', icon: Volume2 },
    { id: 'data', name: 'Données', icon: Download },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Paramètres</h1>
        <p style={{ color: theme.accent }}>Personnalisez votre expérience</p>
      </div>

      {/* Section Navigation */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 mb-6 border border-white/20">
        <div className="grid grid-cols-4 gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{
                  backgroundColor: isActive ? theme.primary : 'transparent',
                }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
        {activeSection === 'theme' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Choisir un thème</h2>
            <div className="grid grid-cols-2 gap-3">
              {defaultThemes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => updateSettings({ theme: themeOption })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme.id === themeOption.id
                      ? 'border-white shadow-lg'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${themeOption.primary}, ${themeOption.secondary})`,
                  }}
                >
                  <div className="text-white font-medium text-sm">{themeOption.name}</div>
                  <div className="flex space-x-1 mt-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeOption.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeOption.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeOption.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'background' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Image d'arrière-plan</h2>
            <div className="space-y-3">
              <button
                onClick={() => updateSettings({ backgroundImage: undefined })}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  !settings.backgroundImage
                    ? 'border-white shadow-lg bg-white/10'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <div className="text-white font-medium">Aucune image</div>
                <div className="text-white/60 text-sm">Utiliser le dégradé du thème</div>
              </button>
              
              {backgroundImages.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => updateSettings({ backgroundImage: bg.url })}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                    settings.backgroundImage === bg.url
                      ? 'border-white shadow-lg'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="text-white font-medium">{bg.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'audio' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Paramètres audio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-white" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-white/60" />
                  )}
                  <div>
                    <div className="text-white font-medium">Sons activés</div>
                    <div className="text-white/60 text-sm">Notifications et effets sonores</div>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    settings.soundEnabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-white">🔔</div>
                  <div>
                    <div className="text-white font-medium">Notifications</div>
                    <div className="text-white/60 text-sm">Alertes du navigateur</div>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ notifications: !settings.notifications })}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    settings.notifications ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'data' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Gestion des données</h2>
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center space-x-3"
              >
                <Download className="w-5 h-5 text-white" />
                <div className="text-left">
                  <div className="text-white font-medium">Exporter les données</div>
                  <div className="text-white/60 text-sm">Sauvegarder vos paramètres et données</div>
                </div>
              </button>

              <label className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 cursor-pointer">
                <Upload className="w-5 h-5 text-white" />
                <div className="text-left">
                  <div className="text-white font-medium">Importer les données</div>
                  <div className="text-white/60 text-sm">Restaurer depuis une sauvegarde</div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>

              <button
                onClick={clearAllData}
                className="w-full p-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 flex items-center space-x-3"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <div className="text-red-400 font-medium">Supprimer toutes les données</div>
                  <div className="text-red-400/60 text-sm">Action irréversible</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;