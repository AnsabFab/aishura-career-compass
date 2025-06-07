
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User, Circle, Book } from 'lucide-react';

interface LeaderboardProps {
  user: any;
}

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  trustScore: number;
  completedQuests: number;
  avatar: string;
  rank: number;
}

export const Leaderboard = ({ user }: LeaderboardProps) => {
  // Mock leaderboard data
  const globalLeaderboard: LeaderboardUser[] = [
    { id: '1', name: 'Sarah Chen', xp: 2850, level: 8, trustScore: 92, completedQuests: 12, avatar: 'tech-leader', rank: 1 },
    { id: '2', name: 'Marcus Johnson', xp: 2650, level: 7, trustScore: 88, completedQuests: 11, avatar: 'career-warrior', rank: 2 },
    { id: '3', name: 'Elena Rodriguez', xp: 2400, level: 7, trustScore: 85, completedQuests: 10, avatar: 'ux-master', rank: 3 },
    { id: '4', name: 'David Park', xp: 2200, level: 6, trustScore: 78, completedQuests: 9, avatar: 'career-warrior', rank: 4 },
    { id: '5', name: 'Anya Patel', xp: 2050, level: 6, trustScore: 82, completedQuests: 8, avatar: 'tech-leader', rank: 5 },
    { id: user.id, name: user.name, xp: user.xp || 850, level: user.level, trustScore: user.trustScore, completedQuests: 3, avatar: user.avatar, rank: 15 },
  ];

  const campusLeaderboard: LeaderboardUser[] = [
    { id: '1', name: 'Alex Thompson', xp: 1850, level: 5, trustScore: 78, completedQuests: 7, avatar: 'ux-master', rank: 1 },
    { id: '2', name: 'Jordan Kim', xp: 1650, level: 5, trustScore: 72, completedQuests: 6, avatar: 'career-warrior', rank: 2 },
    { id: '3', name: 'Sam Wilson', xp: 1400, level: 4, trustScore: 68, completedQuests: 5, avatar: 'career-starter', rank: 3 },
    { id: user.id, name: user.name, xp: user.xp || 850, level: user.level, trustScore: user.trustScore, completedQuests: 3, avatar: user.avatar, rank: 8 },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-muted-foreground';
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = ['bg-yellow-500/20 text-yellow-400', 'bg-gray-500/20 text-gray-300', 'bg-orange-500/20 text-orange-400'];
      return colors[rank - 1];
    }
    return 'bg-muted/20 text-muted-foreground';
  };

  const getAvatarEmoji = (avatar: string) => {
    switch (avatar) {
      case 'career-starter': return '👤';
      case 'career-warrior': return '⚔️';
      case 'ux-master': return '🎨';
      case 'tech-leader': return '🚀';
      default: return '👤';
    }
  };

  const LeaderboardList = ({ data }: { data: LeaderboardUser[] }) => (
    <div className="space-y-3">
      {data.map((player) => (
        <div
          key={player.id}
          className={`glass-effect p-4 rounded-xl border transition-all duration-300 ${
            player.id === user.id
              ? 'border-cosmic-500/50 bg-cosmic-500/10'
              : 'border-cosmic-500/20 hover:border-cosmic-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(player.rank)}`}>
                {player.rank}
              </Badge>
              
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-lg">
                  {getAvatarEmoji(player.avatar)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {player.name}
                  {player.id === user.id && (
                    <Badge variant="outline" className="text-xs text-cosmic-400">
                      You
                    </Badge>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Level {player.level} • {player.completedQuests} quests completed
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-cosmic-400">{player.xp.toLocaleString()} XP</div>
              <div className="text-sm text-muted-foreground">Trust: {player.trustScore}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* User's Current Rank */}
      <Card className="glass-effect border-cosmic-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-cosmic-400" />
            Your Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cosmic-400 mb-1">#15</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-aurora-400 mb-1">#8</div>
              <div className="text-sm text-muted-foreground">Campus Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-400 mb-1">85%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="glass-effect border border-cosmic-500/20 p-1">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Global Rankings
          </TabsTrigger>
          <TabsTrigger value="campus" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Campus Rankings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card className="glass-effect border-cosmic-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-cosmic-400" />
                Global Leaderboard
                <Badge variant="secondary" className="ml-2">
                  Top Performers Worldwide
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList data={globalLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campus">
          <Card className="glass-effect border-aurora-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-aurora-400" />
                Campus Leaderboard
                <Badge variant="secondary" className="ml-2">
                  Your University Rankings
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList data={campusLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Special Achievements */}
      <Card className="glass-effect border-neon-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-neon-400" />
            This Week's Top Achievers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-cosmic-500/10 border border-cosmic-500/20">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-medium text-cosmic-400">Quest Master</h4>
              <p className="text-sm text-muted-foreground">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">5 quests completed</p>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-aurora-500/10 border border-aurora-500/20">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-medium text-aurora-400">Rapid Climber</h4>
              <p className="text-sm text-muted-foreground">Marcus Johnson</p>
              <p className="text-xs text-muted-foreground">+2 levels this week</p>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-neon-500/10 border border-neon-500/20">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-medium text-neon-400">Networking Pro</h4>
              <p className="text-sm text-muted-foreground">Elena Rodriguez</p>
              <p className="text-xs text-muted-foreground">15 new connections</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
