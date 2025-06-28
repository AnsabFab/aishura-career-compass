
import { useState } from 'react';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { UserProgress } from '@/components/UserProgress';
import { QuestSystem } from '@/components/QuestSystem';
import { Leaderboard } from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Book, Circle } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden w-full font-inter">
      {/* Background Enhancement */}
      <div className="fixed inset-0 bg-gradient-to-br from-cosmic-900/20 via-background to-aurora-900/20"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 top-20 left-10 opacity-10" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-64 h-64 top-1/2 right-20 opacity-15" style={{ animationDelay: '3s' }} />
        <div className="floating-orb w-48 h-48 bottom-20 left-1/3 opacity-20" style={{ animationDelay: '6s' }} />
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 glass-effect border-b border-cosmic-500/20 sticky top-0">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-14 h-14 object-contain animate-pulse-glow"
              />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-gradient bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text">
                AIShura
              </h1>
              <p className="text-sm text-muted-foreground">Your AI Career Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-base font-medium text-cosmic-400">Welcome back, {user.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.xp} XP</span>
                  <span>•</span>
                  <span>{user.tokens || 100} Tokens</span>
                </div>
              </div>
              <Avatar className="w-12 h-12 border-2 border-cosmic-500/30">
                <AvatarFallback className="bg-cosmic-500/20 text-cosmic-400">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-cosmic-500/30 text-cosmic-400 hover:bg-cosmic-500/10 text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full h-[calc(100vh-6rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <TabsList className="glass-effect border border-cosmic-500/20 p-2 h-16 mx-6 mt-6 flex-shrink-0">
            <TabsTrigger value="chat" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium">
              <Circle className="w-5 h-5" />
              <span>AI Guide</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium">
              <User className="w-5 h-5" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium">
              <Book className="w-5 h-5" />
              <span>Quests</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura" 
                className="w-5 h-5 object-contain"
              />
              <span>Leaderboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden">
            <EnhancedChatInterface user={user} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-0 p-6 flex-1 overflow-auto">
            <UserProgress user={user} />
          </TabsContent>

          <TabsContent value="quests" className="space-y-0 p-6 flex-1 overflow-auto">
            <QuestSystem user={user} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-0 p-6 flex-1 overflow-auto">
            <Leaderboard user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
