
import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { UserProgress } from '@/components/UserProgress';
import { QuestSystem } from '@/components/QuestSystem';
import { Leaderboard } from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Star, Book, Circle } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect border-b border-cosmic-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-cosmic-400" />
            </div>
            <h1 className="font-orbitron text-xl font-bold text-gradient">AIShura</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Welcome back,</span>
              <span className="font-medium text-cosmic-400">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-cosmic-500/30 text-cosmic-400 hover:bg-cosmic-500/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-effect border border-cosmic-500/20 p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Circle className="w-4 h-4" />
              AI Guide
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-0">
            <ChatInterface user={user} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-0">
            <UserProgress user={user} />
          </TabsContent>

          <TabsContent value="quests" className="space-y-0">
            <QuestSystem user={user} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-0">
            <Leaderboard user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
