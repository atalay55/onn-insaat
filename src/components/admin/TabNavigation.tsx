import { Building2, MessageSquare, Image, Users } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'projects' | 'messages' | 'sketches' | 'team';
  onTabChange: (tab: 'projects' | 'messages' | 'sketches' | 'team') => void;
  messagesCount: number;
  sketchesCount: number;
  teamCount?: number;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  messagesCount,
  sketchesCount,
  teamCount = 0,
}: TabNavigationProps) {
  const tabs = [
    {
      id: 'projects' as const,
      label: 'Projeler',
      icon: Building2,
    },
    {
      id: 'messages' as const,
      label: 'Mesajlar',
      icon: MessageSquare,
      count: messagesCount,
    },
    {
      id: 'sketches' as const,
      label: 'Eskizler',
      icon: Image,
      count: sketchesCount,
    },
    {
      id: 'team' as const,
      label: 'Ekip',
      icon: Users,
      count: teamCount,
    },
  ];

  return (
    <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-4 lg:px-6 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-400'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? 'bg-emerald-600/30 text-emerald-300'
                    : 'bg-zinc-700/50 text-white/70'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}