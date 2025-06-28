
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, Trophy, Calendar, Star } from 'lucide-react';

interface UserProgressProps {
  user: any;
}

export const UserProgress = ({ user }: UserProgressProps) => {
  const progressData = [
    {
      title: "Career Development",
      progress: 75,
      icon: TrendingUp,
      color: "from-purple-400 to-pink-400",
      description: "Skills and knowledge advancement"
    },
    {
      title: "Network Building",
      progress: 60,
      icon: Target,
      color: "from-cyan-400 to-blue-400",
      description: "Professional connections growth"
    },
    {
      title: "Goal Achievement",
      progress: 85,
      icon: Trophy,
      color: "from-pink-400 to-purple-400",
      description: "Completed milestones and objectives"
    }
  ];

  const achievements = [
    { name: "First Steps", description: "Completed onboarding", date: "2024-01-01", icon: Star },
    { name: "Network Builder", description: "Connected with 10+ professionals", date: "2024-01-15", icon: Target },
    { name: "Skill Master", description: "Completed 5 skill assessments", date: "2024-02-01", icon: Zap }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Your Progress Journey
        </h2>
        <p className="text-gray-300 text-lg">Track your career advancement with AIShura</p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {progressData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Progress</span>
                    <span className={`font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.progress}%
                    </span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-cyan-400 p-2">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{achievement.name}</h3>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </Badge>
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
