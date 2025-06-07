
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Star, User } from 'lucide-react';

interface HeroProps {
  onAuthClick: () => void;
}

export const Hero = ({ onAuthClick }: HeroProps) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const heroTexts = [
    "Find Your Dream Career",
    "Overcome Career Hesitation", 
    "Build Your Future",
    "Unlock Your Potential"
  ];

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-cosmic-600 via-aurora-600 to-neon-600 animate-pulse" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-20">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-orbitron text-6xl md:text-8xl font-bold text-gradient mb-4">
            AIShura
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cosmic-500 to-aurora-500 rounded-full" />
        </div>

        {/* Dynamic Typing Text */}
        <div className="mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl md:text-4xl font-inter font-light text-foreground/90 mb-4">
            Your Emotionally Intelligent AI Career Guide
          </h2>
          <div className="h-16 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-medium text-cosmic-400">
              {currentText}
              <span className="typing-indicator ml-1" />
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="glass-effect p-6 rounded-xl border border-cosmic-500/20 hover:border-cosmic-500/40 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-cosmic-400" />
            </div>
            <h3 className="font-semibold mb-2">Hesitation Detection</h3>
            <p className="text-sm text-muted-foreground">
              Our AI detects when you're unsure and provides empathetic guidance
            </p>
          </div>

          <div className="glass-effect p-6 rounded-xl border border-aurora-500/20 hover:border-aurora-500/40 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-aurora-500/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-aurora-400" />
            </div>
            <h3 className="font-semibold mb-2">Evolving Companion</h3>
            <p className="text-sm text-muted-foreground">
              AIShura grows with you, adapting its personality to your trust level
            </p>
          </div>

          <div className="glass-effect p-6 rounded-xl border border-neon-500/20 hover:border-neon-500/40 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-neon-500/20 rounded-lg flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-neon-400" />
            </div>
            <h3 className="font-semibold mb-2">Action-Oriented</h3>
            <p className="text-sm text-muted-foreground">
              Get direct links to opportunities and actionable career guidance
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button 
            onClick={onAuthClick}
            className="bg-cosmic-600 hover:bg-cosmic-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-cosmic-500/25 transition-all duration-300 animate-pulse-glow"
          >
            Start Your Journey
          </Button>
          <Button 
            variant="outline"
            onClick={onAuthClick}
            className="border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10 px-8 py-4 text-lg rounded-xl"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-cosmic-400 mb-1">10K+</div>
            <div className="text-sm text-muted-foreground">Career Journeys</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-aurora-400 mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-neon-400 mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-cosmic-400 mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Success Stories</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <ArrowDown className="w-6 h-6 text-cosmic-400" />
      </div>
    </div>
  );
};
