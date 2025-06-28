
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Book, Target, Zap, Trophy, CheckCircle, Clock, Star } from 'lucide-react';

interface QuestSystemProps {
  user: any;
}

export const QuestSystem = ({ user }: QuestSystemProps) => {
  const [activeQuests, setActiveQuests] = useState([
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Fill out all sections of your professional profile",
      progress: 80,
      xpReward: 50,
      status: "active",
      difficulty: "Easy",
      category: "Profile"
    },
    {
      id: 2,
      title: "Network Builder",
      description: "Connect with 10 professionals in your industry",
      progress: 30,
      xpReward: 100,
      status: "active",
      difficulty: "Medium",
      category: "Networking"
    },
    {
      id: 3,
      title: "Skill Assessment",
      description: "Complete 3 skill assessments to showcase your abilities",
      progress: 66,
      xpReward: 75,
      status: "active",
      difficulty: "Medium",
      category: "Skills"
    }
  ]);

  const completedQuests = [
    {
      id: 4,
      title: "First Steps",
      description: "Complete the onboarding process",
      xpReward: 25,
      completedDate: "2024-01-15",
      category: "Onboarding"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "from-green-400 to-emerald-400";
      case "Medium": return "from-yellow-400 to-orange-400";
      case "Hard": return "from-red-400 to-pink-400";
      default: return "from-purple-400 to-cyan-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Profile": return Target;
      case "Networking": return Book;
      case "Skills": return Zap;
      case "Onboarding": return Star;
      default: return Trophy;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Career Quests
        </h2>
        <p className="text-gray-300 text-lg">Complete challenges to advance your career journey</p>
      </div>

      {/* Active Quests */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <Clock className="w-5 h-5 text-cyan-400" />
          Active Quests
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeQuests.map((quest) => {
            const IconComponent = getCategoryIcon(quest.category);
            return (
              <Card key={quest.id} className="bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-cyan-400 p-2">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{quest.title}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 border-transparent bg-gradient-to-r ${getDifficultyColor(quest.difficulty)} text-white text-xs`}
                        >
                          {quest.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{quest.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Progress</span>
                      <span className="text-cyan-300 font-semibold">{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{quest.xpReward} XP</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Quests */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Completed Quests
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedQuests.map((quest) => {
            const IconComponent = getCategoryIcon(quest.category);
            return (
              <Card key={quest.id} className="bg-black/10 backdrop-blur-xl border border-green-400/20 opacity-80">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 p-2">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{quest.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 border-green-400/30 text-green-300 text-xs">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{quest.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">+{quest.xpReward} XP</span>
                    </div>
                    <span className="text-gray-400 text-sm">{new Date(quest.completedDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
