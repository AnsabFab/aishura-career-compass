
import { useState } from 'react';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { UserProgress } from '@/components/UserProgress';
import { QuestSystem } from '@/components/QuestSystem';
import { Leaderboard } from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Book, Circle, TrendingUp, Trophy, Sparkles, Rocket, Brain, Target, Zap } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartJourney = () => {
    setShowOnboarding(true);
    setActiveTab('chat');
  };

  if (showOnboarding) {
    return <EnhancedChatInterface user={user} forceOnboarding={true} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden w-full font-inter">
      {/* Main AI Background */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/fbb882b0-de75-4081-89cf-5f59296ca7d3.png" 
          alt="AI Neural Network Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/95" />
      </div>

      {/* Floating Neural Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 top-20 left-10 opacity-20 bg-gradient-to-r from-purple-500/30 to-cyan-500/30" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-64 h-64 top-1/2 right-20 opacity-15 bg-gradient-to-r from-blue-500/30 to-pink-500/30" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-48 h-48 bottom-20 left-1/3 opacity-25 bg-gradient-to-r from-cyan-500/30 to-purple-500/30" style={{ animationDelay: '4s' }} />
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="w-full px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-16 h-16 object-contain animate-pulse-glow"
              />
            </div>
            <div>
              <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                AIShura
              </h1>
              <p className="text-base text-gray-300 font-medium">Your AI Career Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-semibold text-white">Welcome back, {user.name}</p>
                <div className="flex items-center gap-6 text-base text-gray-300 mt-2">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Level {user.level}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    {user.xp} XP
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    {user.tokens || 100} Tokens
                  </span>
                </div>
              </div>
              <Avatar className="w-16 h-16 border-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl">
                <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xl">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={onLogout}
              className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-300 text-base bg-black/20 backdrop-blur-xl px-6 py-3"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full h-[calc(100vh-7rem)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <TabsList className="bg-black/20 backdrop-blur-xl border border-white/10 p-3 h-20 mx-8 mt-8 flex-shrink-0">
            <TabsTrigger value="overview" className="flex items-center gap-4 h-14 px-10 rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-xl">
              <Brain className="w-6 h-6" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-4 h-14 px-10 rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-xl">
              <Circle className="w-6 h-6" />
              <span>AI Guide</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-4 h-14 px-10 rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-xl">
              <TrendingUp className="w-6 h-6" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-4 h-14 px-10 rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-xl">
              <Book className="w-6 h-6" />
              <span>Quests</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-4 h-14 px-10 rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-xl">
              <Trophy className="w-6 h-6" />
              <span>Leaderboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 flex-1 overflow-hidden p-8">
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-12 max-w-4xl">
                {/* Main Hero Section */}
                <div className="space-y-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                    <img 
                      src="/lovable-uploads/01cfc819-ea83-4584-850c-44154d542746.png"
                      alt="AI Career Universe"
                      className="relative w-80 h-80 mx-auto object-cover rounded-full border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      Ready to Transform Your Career?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      Your personalized AI career companion is ready to guide you through an 
                      intelligent journey of discovery, growth, and achievement.
                    </p>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-8">
                  <Button 
                    onClick={handleStartJourney}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group font-orbitron font-bold"
                  >
                    <Rocket className="mr-4 w-8 h-8 group-hover:scale-110 transition-transform" />
                    Start Your Journey
                    <Sparkles className="ml-4 w-8 h-8 group-hover:rotate-12 transition-transform" />
                  </Button>
                  
                  <p className="text-gray-400 text-base">
                    Begin your personalized onboarding experience and unlock your career potential
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  {[
                    { 
                      icon: Brain, 
                      title: "AI-Powered Insights", 
                      description: "Advanced neural networks analyze your career patterns",
                      color: "from-purple-400 to-pink-400",
                      image: "/lovable-uploads/e93683f1-f790-4100-8e1e-02ce35c348ee.png"
                    },
                    { 
                      icon: Target, 
                      title: "Personalized Guidance", 
                      description: "Tailored recommendations based on your unique journey",
                      color: "from-cyan-400 to-blue-400",
                      image: "/lovable-uploads/426d49d4-ebf8-4f7d-8285-92c183e49442.png"
                    },
                    { 
                      icon: Zap, 
                      title: "Real-time Support", 
                      description: "Instant feedback and emotional intelligence",
                      color: "from-pink-400 to-purple-400",
                      image: "/lovable-uploads/8e8dd624-3d38-4659-b734-54f3888324e1.png"
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="group">
                        <div className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-black/30 hover:scale-105 transition-all duration-300 space-y-6">
                          <img 
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-32 object-cover rounded-2xl"
                          />
                          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h3 className={`text-xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                              {feature.title}
                            </h3>
                            <p className="text-gray-400 text-base">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden">
            <EnhancedChatInterface user={user} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-0 p-8 flex-1 overflow-auto">
            <UserProgress user={user} />
          </TabsContent>

          <TabsContent value="quests" className="space-y-0 p-8 flex-1 overflow-auto">
            <QuestSystem user={user} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-0 p-8 flex-1 overflow-auto">
            <Leaderboard user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
