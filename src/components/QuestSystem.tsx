
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, Star, User, Circle, Check } from 'lucide-react';

interface QuestSystemProps {
  user: any;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'story' | 'career' | 'skill';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  tokenReward: number;
  requirements: string[];
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: any;
}

export const QuestSystem = ({ user }: QuestSystemProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const quests: Quest[] = [
    {
      id: '1',
      title: 'The Resume Blacksmith',
      description: 'Forge your professional identity by crafting a compelling resume that tells your career story.',
      category: 'career',
      difficulty: 'beginner',
      xpReward: 200,
      tokenReward: 50,
      requirements: ['Complete career assessment', 'Upload current resume', 'Use AI suggestions'],
      progress: 1,
      maxProgress: 3,
      completed: false,
      icon: Book
    },
    {
      id: '2',
      title: 'Network Navigator',
      description: 'Expand your professional circle by connecting with industry professionals and mentors.',
      category: 'skill',
      difficulty: 'intermediate',
      xpReward: 300,
      tokenReward: 75,
      requirements: ['Connect with 5 professionals', 'Join 2 industry groups', 'Send follow-up messages'],
      progress: 2,
      maxProgress: 3,
      completed: false,
      icon: User
    },
    {
      id: '3',
      title: 'The Confidence Chronicles',
      description: 'Unlock a personal story about overcoming interview anxiety and building self-confidence.',
      category: 'story',
      difficulty: 'beginner',
      xpReward: 150,
      tokenReward: 30,
      requirements: ['Complete 3 emotion logs', 'Practice mock interview', 'Reflect on growth'],
      progress: 3,
      maxProgress: 3,
      completed: true,
      icon: Star
    },
    {
      id: '4',
      title: 'Industry Intel Gatherer',
      description: 'Research and analyze your target industry to make informed career decisions.',
      category: 'career',
      difficulty: 'advanced',
      xpReward: 500,
      tokenReward: 100,
      requirements: ['Research 3 companies', 'Analyze salary trends', 'Identify skill gaps', 'Create action plan'],
      progress: 0,
      maxProgress: 4,
      completed: false,
      icon: Circle
    },
    {
      id: '5',
      title: 'The Mentor Quest',
      description: 'Find and connect with a mentor who can guide your career journey.',
      category: 'skill',
      difficulty: 'intermediate',
      xpReward: 400,
      tokenReward: 80,
      requirements: ['Identify potential mentors', 'Craft outreach message', 'Schedule meeting'],
      progress: 0,
      maxProgress: 3,
      completed: false,
      icon: User
    }
  ];

  const filteredQuests = activeCategory === 'all' 
    ? quests 
    : quests.filter(quest => quest.category === activeCategory);

  const handleStartQuest = (questId: string) => {
    console.log(`Starting quest: ${questId}`);
    // In a real app, this would update the quest state
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 border-green-400/30';
      case 'intermediate': return 'text-yellow-400 border-yellow-400/30';
      case 'advanced': return 'text-red-400 border-red-400/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'story': return 'text-aurora-400 bg-aurora-500/10';
      case 'career': return 'text-cosmic-400 bg-cosmic-500/10';
      case 'skill': return 'text-neon-400 bg-neon-500/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quest Categories */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('all')}
          className="text-sm"
        >
          All Quests
        </Button>
        <Button
          variant={activeCategory === 'story' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('story')}
          className="text-sm"
        >
          Story Arcs
        </Button>
        <Button
          variant={activeCategory === 'career' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('career')}
          className="text-sm"
        >
          Career Quests
        </Button>
        <Button
          variant={activeCategory === 'skill' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('skill')}
          className="text-sm"
        >
          Skill Building
        </Button>
      </div>

      {/* Quest Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredQuests.map((quest) => (
          <Card key={quest.id} className="glass-effect border-cosmic-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
                    <quest.icon className="w-5 h-5 text-cosmic-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{quest.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(quest.category)}>
                        {quest.category}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                        {quest.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                {quest.completed && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{quest.description}</p>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{quest.progress}/{quest.maxProgress}</span>
                </div>
                <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Requirements:</h4>
                <ul className="space-y-1">
                  {quest.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        index < quest.progress 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-muted/20 text-muted-foreground'
                      }`}>
                        {index < quest.progress ? (
                          <Check className="w-2 h-2" />
                        ) : (
                          <Circle className="w-2 h-2" />
                        )}
                      </div>
                      <span className={index < quest.progress ? 'line-through opacity-60' : ''}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rewards */}
              <div className="flex justify-between items-center pt-2 border-t border-muted/20">
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-cosmic-400" />
                    {quest.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="w-3 h-3 text-neon-400" />
                    {quest.tokenReward} Tokens
                  </span>
                </div>
                
                {quest.completed ? (
                  <Badge variant="secondary" className="text-green-400">
                    Completed
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleStartQuest(quest.id)}
                    className="bg-cosmic-600 hover:bg-cosmic-700"
                  >
                    {quest.progress > 0 ? 'Continue' : 'Start Quest'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quest Completion Stats */}
      <Card className="glass-effect border-aurora-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-aurora-400" />
            Quest Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-aurora-400 mb-1">
                {quests.filter(q => q.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Quests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cosmic-400 mb-1">
                {quests.filter(q => q.progress > 0 && !q.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-400 mb-1">
                {quests.reduce((total, q) => total + (q.completed ? q.xpReward : 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total XP Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
