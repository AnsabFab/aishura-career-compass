
import { useState } from 'react';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { UserProgress } from '@/components/UserProgress';
import { QuestSystem } from '@/components/QuestSystem';
import { Leaderboard } from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Book, Circle, TrendingUp, Trophy } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen ai-neural-bg relative overflow-hidden w-full font-inter">
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb-ai w-96 h-96 top-20 left-10 opacity-20" />
        <div className="floating-orb-ai w-64 h-64 top-1/2 right-20 opacity-15" />
        <div className="floating-orb-ai w-48 h-48 bottom-20 left-1/3 opacity-25" />
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 ai-glass-effect border-b border-white/10 sticky top-0">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-12 h-12 object-contain animate-pulse"
              />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold ai-glow-text">
                AIShura
              </h1>
              <p className="text-sm text-gray-400">Your AI Career Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-medium text-white">Welcome back, {user.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Level {user.level}
                  </span>
                  <span>•</span>
                  <span>{user.xp} XP</span>
                  <span>•</span>
                  <span>{user.tokens || 100} Tokens</span>
                </div>
              </div>
              <Avatar className="w-14 h-14 border-2 border-purple-400/30 ai-glass-effect">
                <AvatarFallback className="bg-purple-500/20 text-purple-300">
                  <User className="w-7 h-7" />
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-300 text-sm ai-glass-effect"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full h-[calc(100vh-6rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <TabsList className="ai-glass-effect border border-white/10 p-2 h-16 mx-6 mt-6 flex-shrink-0">
            <TabsTrigger value="chat" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white">
              <Circle className="w-5 h-5" />
              <span>AI Guide</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white">
              <TrendingUp className="w-5 h-5" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white">
              <Book className="w-5 h-5" />
              <span>Quests</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-3 h-12 px-8 rounded-lg text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white">
              <Trophy className="w-5 h-5" />
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
