import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Sparkles, ArrowRight, Users, Trophy, Zap, Brain, Target, Rocket } from 'lucide-react';

interface VideoHeroProps {
  onAuthClick: () => void;
}

export const VideoHero = ({ onAuthClick }: VideoHeroProps) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [careerGoal, setCareerGoal] = useState('');

  const heroTexts = [
    "Transform Your Career Journey",
    "Unlock Your True Potential", 
    "Navigate With Confidence",
    "Achieve Your Dreams"
  ];

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 120;
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

  const handleCareerGoalSubmit = () => {
    if (careerGoal.trim()) {
      // Store the goal and redirect to auth
      localStorage.setItem('career_goal', careerGoal.trim());
      onAuthClick();
    }
  };

  const aiGeneratedSamples = [
    { 
      title: "Neural Networks", 
      image: "/lovable-uploads/5ca24359-50be-4bcd-be20-51971e0d820e.png",
      description: "Advanced AI algorithms at work"
    },
    { 
      title: "Digital Consciousness", 
      image: "/lovable-uploads/8e8dd624-3d38-4659-b734-54f3888324e1.png",
      description: "The future of human-AI interaction"
    },
    { 
      title: "Quantum Realm", 
      image: "/lovable-uploads/426d49d4-ebf8-4f7d-8285-92c183e49442.png",
      description: "Exploring infinite possibilities"
    },
    { 
      title: "Cosmic Intelligence", 
      image: "/lovable-uploads/e93683f1-f790-4100-8e1e-02ce35c348ee.png",
      description: "Where creativity meets technology"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Main AI Background */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/f75da6ee-c1bb-4473-a4d3-7ca8ab9407ef.png" 
          alt="AI Neural Network Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Floating Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 top-20 left-10 opacity-20 bg-gradient-to-r from-purple-500/30 to-cyan-500/30" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-64 h-64 top-1/2 right-20 opacity-15 bg-gradient-to-r from-blue-500/30 to-pink-500/30" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-48 h-48 bottom-20 left-1/3 opacity-25 bg-gradient-to-r from-cyan-500/30 to-purple-500/30" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-left space-y-8">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30 px-6 py-3 text-base animate-fade-in backdrop-blur-xl">
              <Brain className="w-5 h-5 mr-3" />
              <span className="text-white">Powered by Advanced Neural AI</span>
            </Badge>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold">
                <span className="text-white">Unleash Your Career</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  WITH AI
                </span>
              </h1>
              
              {/* Dynamic Typing Subtitle */}
              <div className="h-16 flex items-center">
                <span className="text-xl md:text-2xl text-gray-300 font-light">
                  {currentText}
                  <span className="animate-pulse ml-1 text-cyan-400">|</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              Experience the power of AI-generated career guidance with our user-friendly platform. 
              From abstract goals to realistic achievements, our technology enables you to easily 
              create stunning career paths that are entirely unique.
            </p>

            {/* Input Section */}
            <div className="relative max-w-md">
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 hover:bg-white/15 transition-all duration-300">
                <input 
                  type="text" 
                  placeholder="Describe your career goals..."
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none text-base"
                />
                <Button 
                  onClick={handleCareerGoalSubmit}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={onAuthClick}
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group font-orbitron"
              >
                <Rocket className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={onAuthClick}
                variant="outline"
                size="lg"
                className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg rounded-2xl backdrop-blur-xl group font-orbitron"
              >
                <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                Experience Demo
              </Button>
            </div>
          </div>

          {/* Right Content - AI Generated Showcase */}
          <div className="relative">
            {/* Main Featured Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:scale-105 transition-all duration-500">
                <img 
                  src="/lovable-uploads/f8f28477-2f46-41eb-9478-3afa4e0b649d.png"
                  alt="AI Generated Career Vision"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-xl font-bold mb-2">Your Career Universe</h3>
                  <p className="text-gray-300 text-sm">Infinite possibilities await</p>
                </div>
              </div>
            </div>

            {/* Sample Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {aiGeneratedSamples.map((sample, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 hover:scale-105 transition-all duration-300">
                    <img 
                      src={sample.image}
                      alt={sample.title}
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <div className="mt-2">
                      <h4 className="text-white text-xs font-semibold">{sample.title}</h4>
                      <p className="text-gray-400 text-xs">{sample.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, value: "50K+", label: "Career Transformations", color: "from-purple-400 to-pink-400" },
            { icon: Trophy, value: "98%", label: "Success Rate", color: "from-cyan-400 to-blue-400" },
            { icon: Target, value: "24/7", label: "AI Guidance", color: "from-pink-400 to-purple-400" }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} p-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 font-orbitron`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
