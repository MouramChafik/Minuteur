import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { UserSettings } from './types';
import { defaultThemes } from './data/themes';

// Components
import Navigation from './components/Navigation';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import Notes from './components/Notes';
import Pomodoro from './components/Pomodoro';
import FocusMode from './components/FocusMode';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  
  const [settings, setSettings] = useLocalStorage<UserSettings>('userSettings', {
    theme: defaultThemes[0],
    customAudios: [],
    soundEnabled: true,
    notifications: true,
  });

  const backgroundStyle = settings.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${settings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    : {
        background: `linear-gradient(135deg, ${settings.theme.background})`,
      };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer theme={settings.theme} soundEnabled={settings.soundEnabled} />;
      case 'pomodoro':
        return <Pomodoro theme={settings.theme} soundEnabled={settings.soundEnabled} />;
      case 'todo':
        return <TodoList theme={settings.theme} />;
      case 'notes':
        return <Notes theme={settings.theme} />;
      case 'focus':
        return <FocusMode theme={settings.theme} />;
      case 'settings':
        return (
          <Settings
            theme={settings.theme}
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      default:
        return <Timer theme={settings.theme} soundEnabled={settings.soundEnabled} />;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 pb-24 transition-all duration-500"
      style={{
      ...backgroundStyle,
      backgroundColor: '#000000',
      backgroundImage: `${backgroundStyle.backgroundImage || ''}, radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.9) 100%)`,
      boxShadow: 'inset 0 0 100px rgba(255,255,255,0.1)'
      }}
    >
      <div className="w-full max-w-md mx-auto">
      {renderActiveTab()}
      </div>
      
      <Navigation
      activeTab={activeTab}
      onTabChange={setActiveTab}
      theme={settings.theme}
      />
    </div>
  );
}

export default App;