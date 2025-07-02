
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
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/62397bd5-a6ce-4725-b678-ce929bb028b5.png')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-transparent to-cyan-900/80" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <img 
                    src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                    alt="AIShura Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold font-orbitron text-white leading-tight">
                Unleash your career
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  WITH AI
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience the power of AI-generated career guidance with our user-friendly platform. From strategic planning to personalized mentorship, our technology enables you to easily create stunning career paths that are entirely unique.
              </p>

              {!showGoalInput ? (
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center pt-8">
                  <div className="relative w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Describe your career goals..."
                      className="w-full h-16 px-8 pr-16 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full text-white placeholder:text-gray-400 text-lg focus:outline-none focus:border-purple-400 transition-all"
                      onFocus={handleGetStarted}
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-8 space-y-6">
                  <div className="bg-black/30 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 max-w-2xl mx-auto lg:mx-0">
                    <h3 className="text-2xl font-semibold text-white mb-4 font-orbitron">
                      Describe Your Career Goals
                    </h3>
                    <textarea
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      placeholder="e.g., I want to transition into data science, looking for leadership opportunities in tech..."
                      className="w-full h-32 px-6 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 transition-colors"
                    />
                    <div className="flex gap-4 mt-6">
                      <Button
                        onClick={handleGoalSubmit}
                        disabled={!careerGoal.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        Continue to AIShura
                      </Button>
                      <Button
                        onClick={() => setShowGoalInput(false)}
                        variant="outline"
                        className="border-2 border-white/30 text-white hover:bg-white/10 py-4 px-8 rounded-2xl"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - AI Visual */}
          <div className="relative">
            <div className="relative">
              {/* Main AI Portrait */}
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-3xl blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-cyan-900/50 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-4 shadow-2xl">
                  <img 
                    src="/lovable-uploads/62397bd5-a6ce-4725-b678-ce929bb028b5.png"
                    alt="AI Avatar"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl animate-bounce opacity-80"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse opacity-80"></div>
              <div className="absolute top-1/2 -left-12 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin opacity-60"></div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              {[
                "/lovable-uploads/e93683f1-f790-4100-8e1e-02ce35c348ee.png",
                "/lovable-uploads/426d49d4-ebf8-4f7d-8285-92c183e49442.png",
                "/lovable-uploads/8e8dd624-3d38-4659-b734-54f3888324e1.png",
                "/lovable-uploads/01cfc819-ea83-4584-850c-44154d542746.png"
              ].map((src, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
                  <img 
                    src={src}
                    alt={`AI Example ${index + 1}`}
                    className="relative w-full h-20 object-cover rounded-xl border-2 border-white/20 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-0 left-0 w-full py-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <p className="text-gray-300">Job Placement Success</p>
            </div>
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">4.8/5</div>
              <p className="text-gray-300">Average User Rating</p>
            </div>
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">300+</div>
              <p className="text-gray-300">AI-Driven Career Paths</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
