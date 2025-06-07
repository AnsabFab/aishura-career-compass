
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User, Circle, Book } from 'lucide-react';

interface UserProgressProps {
  user: any;
}

export const UserProgress = ({ user }: UserProgressProps) => {
  const levelProgress = (user.xp % 1000) / 10; // XP needed for next level
  const badges = [
    { name: 'Career Explorer', description: 'Started your journey', earned: true, icon: Circle },
    { name: 'Self-Discovery Master', description: 'Completed 5 self-assessments', earned: user.xp >= 500, icon: User },
    { name: 'Action Taker', description: 'Completed 3 career actions', earned: user.xp >= 800, icon: Star },
    { name: 'Networking Pro', description: 'Connected with 10 professionals', earned: user.xp >= 1200, icon: Book },
  ];

  const avatarThemes = [
    { name: 'Career Starter', cost: 0, owned: true, description: 'Default professional look' },
    { name: 'Career Warrior', cost: 200, owned: user.tokens >= 200, description: 'Bold and confident style' },
    { name: 'UX Master', cost: 300, owned: user.tokens >= 300, description: 'Creative and innovative design' },
    { name: 'Tech Leader', cost: 500, owned: user.tokens >= 500, description: 'Future-focused appearance' },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect border-cosmic-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-cosmic-400" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-cosmic-400">Level {user.level}</span>
                <span className="text-sm text-muted-foreground">{user.xp} XP</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.max(0, 1000 - (user.xp % 1000))} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-aurora-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Circle className="w-5 h-5 text-aurora-400" />
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-aurora-400">{user.trustScore}</span>
                <span className="text-sm text-muted-foreground">
                  {user.trustScore <= 30 ? 'Cheerful' : user.trustScore <= 70 ? 'Practical' : 'Strategic'}
                </span>
              </div>
              <Progress value={user.trustScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                AIShura's personality evolves with your trust level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-neon-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Book className="w-5 h-5 text-neon-400" />
              Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-neon-400">{user.tokens}</span>
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Earn tokens by completing quests and taking career actions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="glass-effect border-cosmic-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-cosmic-400" />
            Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  badge.earned
                    ? 'border-cosmic-500/40 bg-cosmic-500/10'
                    : 'border-muted/20 bg-muted/5 opacity-60'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.earned ? 'bg-cosmic-500/20' : 'bg-muted/20'
                  }`}>
                    <badge.icon className={`w-6 h-6 ${
                      badge.earned ? 'text-cosmic-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  {badge.earned && (
                    <Badge variant="secondary" className="text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avatar Customization */}
      <Card className="glass-effect border-aurora-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-aurora-400" />
            Avatar Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {avatarThemes.map((theme) => (
              <div
                key={theme.name}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  theme.owned
                    ? 'border-aurora-500/40 bg-aurora-500/10'
                    : 'border-muted/20 bg-muted/5'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                    theme.owned ? 'bg-aurora-500/20' : 'bg-muted/20'
                  }`}>
                    🎭
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </div>
                  {theme.cost === 0 ? (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  ) : theme.owned ? (
                    <Badge variant="secondary" className="text-xs">Owned</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {theme.cost} tokens
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
