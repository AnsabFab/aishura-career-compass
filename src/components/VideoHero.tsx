
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
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
        {/* Animated Stars */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <div 
              className="w-1 h-1 bg-white rounded-full"
              style={{
                boxShadow: `0 0 ${1 + Math.random() * 4}px rgba(255, 255, 255, 0.8)`
              }}
            />
          </div>
        ))}

        {/* Floating Cosmic Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-500/25 to-orange-500/25 rounded-full blur-lg animate-pulse"></div>
      </div>

      {/* Main Content - Better Aligned Layout */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo Section */}
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl animate-pulse scale-150"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <img 
                    src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                    alt="AIShura Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-lg text-purple-300 font-orbitron">*AIShura</p>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white leading-tight">
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Cosmic Career
                </span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Guide
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Navigate your career journey through the cosmos with{' '}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                  AI-powered intelligence
                </span>{' '}
                and unlock your infinite potential among the stars.
              </p>
            </div>

            {/* Career Goal Input */}
            {!showGoalInput ? (
              <div className="space-y-6">
                <div className="relative max-w-2xl mx-auto lg:mx-0">
                  <input
                    type="text"
                    placeholder="What's your cosmic career destination? Share your stellar vision..."
                    className="w-full h-16 px-8 pr-20 bg-black/40 backdrop-blur-xl border-2 border-purple-500/40 rounded-full text-white placeholder:text-gray-300 text-lg focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 shadow-2xl"
                    onFocus={handleGetStarted}
                  />
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    onClick={handleGetStarted}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl p-8 max-w-2xl mx-auto lg:mx-0 shadow-2xl">
                <h3 className="text-2xl font-semibold text-white mb-6 font-orbitron text-center">
                  🌟 Define Your Cosmic Career Vision
                </h3>
                <textarea
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="Describe your stellar career aspirations..."
                  className="w-full h-32 px-6 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-gray-300 resize-none focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-lg"
                />
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleGoalSubmit}
                    disabled={!careerGoal.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-4 rounded-2xl font-bold disabled:opacity-50 text-lg transition-all duration-300 hover:scale-[1.02] shadow-2xl"
                  >
                    🚀 Launch My Journey
                  </Button>
                  <Button
                    onClick={() => setShowGoalInput(false)}
                    variant="outline"
                    className="border-2 border-white/40 text-white hover:bg-white/10 py-4 px-8 rounded-2xl transition-all duration-300 bg-transparent hover:border-purple-400"
                  >
                    ← Back
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - AI Feature Cards Grid */}
          <div className="relative">
            {/* Main Featured Card */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 rounded-2xl blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-cyan-900/30 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/935d9afe-48d9-4a4e-961f-81e075c5940d.png"
                  alt="AI-Powered Intelligence"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Intelligence</h3>
                <p className="text-gray-200">Experience the future of career guidance</p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/lovable-uploads/9e8b5b59-bc11-42cc-b819-9eb8ead7e6cd.png", title: "Neural Networks", desc: "Advanced AI Processing" },
                { src: "/lovable-uploads/9359c5d2-27e0-4e4c-a4d4-365a2dc518b9.png", title: "Quantum Computing", desc: "Next-Gen Analysis" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-cyan-500/40 rounded-xl blur-lg group-hover:blur-sm transition-all duration-300"></div>
                  <div className="relative bg-black/30 backdrop-blur-xl border-2 border-white/20 rounded-xl overflow-hidden shadow-xl">
                    <img 
                      src={item.src}
                      alt={item.title}
                      className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-white text-sm font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-300 text-xs">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-black/40 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-2 font-orbitron">98%</div>
              <p className="text-gray-200">Cosmic Success Rate</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-2 font-orbitron">10K+</div>
              <p className="text-gray-200">Stellar Careers Launched</p>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 font-orbitron">4.9★</div>
              <p className="text-gray-200">Galactic Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
