
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User, ArrowDown, Brain, Target, Trophy, Zap, Heart, Sparkles } from 'lucide-react';

export const FeatureCards = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      title: "Emotional Intelligence",
      subtitle: "AI that understands your feelings",
      description: "Our advanced AI detects hesitation, uncertainty, and emotional patterns to provide personalized guidance when you need it most.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
      icon: Heart,
      color: "cosmic",
      badge: "Core Feature"
    },
    {
      id: 2,
      title: "Hesitation Detection",
      subtitle: "The AIShura Nudge™",
      description: "Revolutionary technology that senses when you're stuck and provides gentle, empathetic nudges to move forward.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
      icon: Brain,
      color: "aurora",
      badge: "Signature"
    },
    {
      id: 3,
      title: "Career Quests",
      subtitle: "Gamified skill building",
      description: "Transform mundane career tasks into engaging narrative-driven quests with rewards, XP, and achievement unlocks.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      icon: Target,
      color: "neon",
      badge: "Gamification"
    },
    {
      id: 4,
      title: "AI Companion Evolution",
      subtitle: "Grows with your trust",
      description: "AIShura's personality evolves as your relationship deepens, becoming more strategic and personalized over time.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop",
      icon: Sparkles,
      color: "cosmic",
      badge: "Adaptive"
    },
    {
      id: 5,
      title: "Action-Oriented Guidance",
      subtitle: "Direct pathways to success",
      description: "Get embedded job links, networking opportunities, and actionable steps rather than generic career advice.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop",
      icon: Zap,
      color: "aurora",
      badge: "Results-Driven"
    },
    {
      id: 6,
      title: "Progress Visualization",
      subtitle: "See your growth",
      description: "Beautiful visual representations of your career journey with XP tracking, badges, and milestone celebrations.",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&h=400&fit=crop",
      icon: Trophy,
      color: "neon",
      badge: "Visual"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cosmic':
        return {
          border: 'border-cosmic-500/30 hover:border-cosmic-500/60',
          bg: 'bg-cosmic-500/5 hover:bg-cosmic-500/10',
          icon: 'text-cosmic-400',
          badge: 'bg-cosmic-500/20 text-cosmic-300'
        };
      case 'aurora':
        return {
          border: 'border-aurora-500/30 hover:border-aurora-500/60',
          bg: 'bg-aurora-500/5 hover:bg-aurora-500/10',
          icon: 'text-aurora-400',
          badge: 'bg-aurora-500/20 text-aurora-300'
        };
      case 'neon':
        return {
          border: 'border-neon-500/30 hover:border-neon-500/60',
          bg: 'bg-neon-500/5 hover:bg-neon-500/10',
          icon: 'text-neon-400',
          badge: 'bg-neon-500/20 text-neon-300'
        };
      default:
        return {
          border: 'border-cosmic-500/30 hover:border-cosmic-500/60',
          bg: 'bg-cosmic-500/5 hover:bg-cosmic-500/10',
          icon: 'text-cosmic-400',
          badge: 'bg-cosmic-500/20 text-cosmic-300'
        };
    }
  };

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cosmic-500/20 text-cosmic-300 border-cosmic-500/30">
            Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-gradient mb-6">
            Where AI Meets
            <br />
            <span className="text-aurora-400">Emotional Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of career guidance with features designed to understand, 
            inspire, and propel you toward your dream career.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const colors = getColorClasses(feature.color);
            const IconComponent = feature.icon;
            
            return (
              <Card
                key={feature.id}
                className={`group relative overflow-hidden ${colors.border} ${colors.bg} transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                <CardContent className="relative p-8 h-full flex flex-col">
                  {/* Badge */}
                  <Badge className={`self-start mb-4 ${colors.badge}`}>
                    {feature.badge}
                  </Badge>

                  {/* Icon */}
                  <div className={`w-12 h-12 mb-6 ${colors.icon} transform transition-transform group-hover:scale-110`}>
                    <IconComponent className="w-full h-full" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className={`text-sm font-medium mb-4 ${colors.icon}`}>
                      {feature.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg} backdrop-blur-sm flex items-center justify-center`}>
                    <div className="text-center p-6">
                      <IconComponent className={`w-16 h-16 mx-auto mb-4 ${colors.icon}`} />
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Experience this feature in action
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-cosmic-400 animate-bounce">
            <ArrowDown className="w-5 h-5" />
            <span className="text-sm font-medium">Discover More Below</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};
