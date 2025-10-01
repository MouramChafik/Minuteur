import React from 'react';
import { Timer, CheckSquare, FileText, Settings, Brain, Clock } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: any;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, theme }) => {
  const tabs = [
    { id: 'timer', name: 'Minuteur', icon: Timer },
    { id: 'pomodoro', name: 'Pomodoro', icon: Clock },
    { id: 'todo', name: 'Tâches', icon: CheckSquare },
    { id: 'notes', name: 'Notes', icon: FileText },
    { id: 'focus', name: 'Focus', icon: Brain },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10 z-40">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto overflow-x-auto ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? `text-white shadow-lg`
                  : 'text-white/60 hover:text-white/80'
              }`}
              style={{
                backgroundColor: isActive ? theme.primary : 'transparent',
              }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;