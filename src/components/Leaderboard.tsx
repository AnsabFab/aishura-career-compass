
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, User, Crown, Star } from 'lucide-react';

interface LeaderboardProps {
  user: any;
}

export const Leaderboard = ({ user }: LeaderboardProps) => {
  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", xp: 2850, level: 12, badges: 15, streak: 28, avatar: "SC" },
    { rank: 2, name: "Alex Rodriguez", xp: 2720, level: 11, badges: 13, streak: 25, avatar: "AR" },
    { rank: 3, name: "Jordan Kim", xp: 2650, level: 11, badges: 12, streak: 22, avatar: "JK" },
    { rank: 4, name: "Taylor Swift", xp: 2480, level: 10, badges: 11, streak: 20, avatar: "TS" },
    { rank: 5, name: "Morgan Lee", xp: 2350, level: 10, badges: 10, streak: 18, avatar: "ML" },
    { rank: 6, name: user.name, xp: user.xp || 120, level: user.level || 1, badges: 2, streak: 5, avatar: user.name.charAt(0) }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Award;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-orange-400";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-orange-400 to-red-400";
      default: return "from-purple-400 to-cyan-400";
    }
  };

  const topPerformers = leaderboardData.slice(0, 3);
  const otherPerformers = leaderboardData.slice(3);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Career Champions
        </h2>
        <p className="text-gray-300 text-lg">See how you rank among our career advancement community</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topPerformers.map((performer) => {
          const IconComponent = getRankIcon(performer.rank);
          const isCurrentUser = performer.name === user.name;
          
          return (
            <Card 
              key={performer.rank} 
              className={`bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-300 hover:scale-105 ${
                isCurrentUser ? 'ring-2 ring-cyan-400/50' : ''
              }`}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getRankColor(performer.rank)} p-4 mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">#{performer.rank}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="w-16 h-16 mx-auto border-2 border-purple-400/30">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white text-lg font-bold">
                    {performer.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-white font-semibold text-lg">{performer.name}</h3>
                  {isCurrentUser && (
                    <Badge className="mt-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
                      You
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-300">{performer.xp}</div>
                    <div className="text-xs text-gray-400">XP</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-300">Lv.{performer.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300">{performer.badges}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">{performer.streak}d</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Full Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((performer) => {
              const isCurrentUser = performer.name === user.name;
              
              return (
                <div 
                  key={performer.rank} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getRankColor(performer.rank)} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">#{performer.rank}</span>
                  </div>
                  
                  <Avatar className="w-10 h-10 border border-purple-400/30">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white font-semibold">
                      {performer.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{performer.name}</h3>
                      {isCurrentUser && (
                        <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">Level {performer.level}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-purple-300 font-semibold">{performer.xp}</div>
                      <div className="text-gray-400 text-xs">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-300 font-semibold">{performer.badges}</div>
                      <div className="text-gray-400 text-xs">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-300 font-semibold">{performer.streak}d</div>
                      <div className="text-gray-400 text-xs">Streak</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
