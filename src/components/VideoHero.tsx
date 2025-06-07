
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Sparkles, ArrowRight, Users, Trophy, Zap } from 'lucide-react';

interface VideoHeroProps {
  onAuthClick: () => void;
}

export const VideoHero = ({ onAuthClick }: VideoHeroProps) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const heroTexts = [
    "Transform Your Career Journey",
    "Unlock Your True Potential", 
    "Navigate With Confidence",
    "Achieve Your Dreams"
  ];

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 150;
    const currentFullText = heroTexts[textIndex];

    const timer = setTimeout(() => {
      if (!isDeleting && currentText.length < currentFullText.length) {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
      } else if (isDeleting && currentText.length > 0) {
        setCurrentText(currentFullText.slice(0, currentText.length - 1));
      } else if (!isDeleting && currentText.length === currentFullText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText.length === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % heroTexts.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex, heroTexts]);

  const stats = [
    { icon: Users, value: "50K+", label: "Career Journeys" },
    { icon: Trophy, value: "98%", label: "Success Rate" },
    { icon: Zap, value: "24/7", label: "AI Support" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Video Effect */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1920&h=1080&fit=crop" 
          alt="AI Neural Network"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-72 h-72 top-20 left-10 opacity-20" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-56 h-56 top-1/2 right-20 opacity-15" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-40 h-40 bottom-20 left-1/3 opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-20">
        {/* Badge */}
        <Badge className="mb-6 bg-cosmic-500/20 text-cosmic-300 border-cosmic-500/30 px-4 py-2 text-sm animate-fade-in">
          <Sparkles className="w-4 h-4 mr-2" />
          Powered by Advanced AI
        </Badge>

        {/* Main Heading */}
        <div className="mb-8 animate-scale-in">
          <h1 className="font-orbitron text-5xl md:text-8xl font-bold text-gradient mb-6">
            AI<span className="text-aurora-400">Shura</span>
          </h1>
          <div className="h-2 w-48 mx-auto bg-gradient-to-r from-cosmic-500 via-aurora-500 to-neon-500 rounded-full mb-8" />
        </div>

        {/* Dynamic Typing Text */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl md:text-4xl font-inter font-light text-foreground/90 mb-6">
            Your Emotionally Intelligent Career Companion
          </h2>
          <div className="h-20 flex items-center justify-center">
            <span className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text text-transparent">
              {currentText}
              <span className="typing-indicator ml-2" />
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.6s' }}>
          Experience the future of career guidance with AI that understands your emotions, 
          detects hesitation, and transforms uncertainty into confident action.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button 
            onClick={onAuthClick}
            size="lg"
            className="bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-cosmic-500/25 transition-all duration-300 group"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm group"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '1.2s' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="glass-effect p-6 rounded-2xl border border-cosmic-500/20 hover:border-cosmic-500/40 transition-all duration-300 hover:scale-105">
                  <IconComponent className="w-8 h-8 mx-auto mb-4 text-cosmic-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-cosmic-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cosmic-400 rounded-full mt-2 animate-pulse" />
          </div>
          <span className="text-xs text-cosmic-400 font-medium">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};
