
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div 
              className="w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                boxShadow: `0 0 ${2 + Math.random() * 8}px rgba(6, 182, 212, 0.8)`
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-12 text-center lg:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <img 
                  src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                  alt="AIShura Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Career Future
              </span>
              <span className="block text-4xl md:text-5xl mt-4">
                With AI Power
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Experience revolutionary AI-driven career transformation. Our emotionally intelligent platform provides personalized guidance, strategic planning, and breakthrough insights to unlock your unlimited potential.
            </p>
          </div>

          {/* Interactive Input */}
          {!showGoalInput ? (
            <div className="space-y-6">
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <input
                  type="text"
                  placeholder="What's your dream career goal? Tell us your vision..."
                  className="w-full h-16 px-8 pr-20 bg-black/30 backdrop-blur-xl border-2 border-purple-500/30 rounded-full text-white placeholder:text-gray-400 text-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  onFocus={handleGetStarted}
                />
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  onClick={handleGetStarted}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  "Tech Leadership",
                  "Data Science",
                  "Product Management", 
                  "Entrepreneurship",
                  "Creative Director"
                ].map((goal, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCareerGoal(goal);
                      setShowGoalInput(true);
                    }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-white hover:bg-white/20 hover:border-purple-400 transition-all duration-300"
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 max-w-2xl mx-auto lg:mx-0">
              <h3 className="text-2xl font-semibold text-white mb-6 font-orbitron">
                🎯 Describe Your Career Vision
              </h3>
              <textarea
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="Share your career aspirations, challenges, or goals. Our AI will create a personalized transformation plan..."
                className="w-full h-32 px-6 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              />
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleGoalSubmit}
                  disabled={!careerGoal.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  🚀 Start My Transformation
                </Button>
                <Button
                  onClick={() => setShowGoalInput(false)}
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 py-4 px-8 rounded-2xl transition-all duration-300"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - AI Visuals Gallery */}
        <div className="relative">
          {/* Main Featured Image */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-cyan-900/50 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
              <img 
                src="/lovable-uploads/935d9afe-48d9-4a4e-961f-81e075c5940d.png"
                alt="AI Vision"
                className="w-full h-64 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-cyan-900/40 rounded-3xl"></div>
            </div>
          </div>

          {/* Image Gallery Grid */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { src: "/lovable-uploads/9e8b5b59-bc11-42cc-b819-9eb8ead7e6cd.png", title: "AI Intelligence" },
              { src: "/lovable-uploads/9359c5d2-27e0-4e4c-a4d4-365a2dc518b9.png", title: "Neural Networks" },
              { src: "/lovable-uploads/3e595281-e1f7-47b4-a4ed-74db75714f36.png", title: "Future Vision" },
              { src: "/lovable-uploads/4ca4471d-14d9-41e8-b036-6411afa53f24.png", title: "Cosmic Dreams" }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-xl blur-lg group-hover:blur-sm transition-all duration-300"></div>
                <div className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
                  <img 
                    src={item.src}
                    alt={item.title}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl animate-bounce opacity-80"></div>
          <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse opacity-80"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-0 left-0 w-full py-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-2">98%</div>
              <p className="text-gray-300">Success Rate</p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-2">10K+</div>
              <p className="text-gray-300">Careers Transformed</p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2">4.9★</div>
              <p className="text-gray-300">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
