
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onAuthClick: () => void;
}

export const VideoHero = ({ onAuthClick }: HeroProps) => {
  const [careerGoal, setCareerGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);

  const handleGetStarted = () => {
    setShowGoalInput(true);
  };

  const handleGoalSubmit = () => {
    if (careerGoal.trim()) {
      localStorage.setItem('career_goal', careerGoal.trim());
      onAuthClick();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
      >
        <source
          src="/ai-shura-hero-video.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-cosmic-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-all duration-300 shadow-2xl">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-orbitron text-gradient leading-tight">
            AIShura
          </h1>
          
          <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-3xl mx-auto">
            Powered by Advanced Neural AI
          </p>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Transform your career with AI-powered guidance, personalized mentorship, and strategic insights that adapt to your unique professional journey.
          </p>

          {!showGoalInput ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-cosmic-500/25 transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                Start Your Journey
              </Button>
              
              <Button
                onClick={onAuthClick}
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                Experience Demo
              </Button>
            </div>
          ) : (
            <div className="pt-8 space-y-6">
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-white mb-4 font-orbitron">
                  Describe Your Career Goals
                </h3>
                <p className="text-gray-300 mb-6">
                  Tell us about your career aspirations, and we'll personalize your AIShura experience.
                </p>
                <textarea
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g., I want to transition into data science, looking for leadership opportunities in tech, seeking career advancement in marketing..."
                  className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cosmic-400 transition-colors"
                />
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleGoalSubmit}
                    disabled={!careerGoal.trim()}
                    className="flex-1 bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to AIShura
                  </Button>
                  <Button
                    onClick={() => setShowGoalInput(false)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 py-3 px-6 rounded-xl"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full py-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <p className="text-gray-300">Job Placement Success</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.8/5</div>
              <p className="text-gray-300">Average User Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">300+</div>
              <p className="text-gray-300">AI-Driven Career Paths</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
