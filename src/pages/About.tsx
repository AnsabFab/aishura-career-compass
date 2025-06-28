
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter, Github, Mail, Brain, Rocket } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen relative overflow-hidden w-full">
      {/* AI Background */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/f75da6ee-c1bb-4473-a4d3-7ca8ab9407ef.png" 
          alt="AI Neural Network Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/95" />
      </div>

      {/* Floating Neural Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-96 h-96 top-20 left-10 opacity-20 bg-gradient-to-r from-purple-500/30 to-cyan-500/30" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-64 h-64 top-1/2 right-20 opacity-15 bg-gradient-to-r from-blue-500/30 to-pink-500/30" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-48 h-48 bottom-20 left-1/3 opacity-25 bg-gradient-to-r from-cyan-500/30 to-purple-500/30" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Meet Our Visionary Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Behind AIShura's revolutionary career intelligence platform are two passionate innovators 
            dedicated to transforming how people navigate their professional journeys.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Ansab - CTO */}
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-500 hover:scale-105 group">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <img 
                  src="/lovable-uploads/707e57e2-9c79-4e27-a1ef-003ce0daae69.png"
                  alt="Ansab - CTO"
                  className="relative w-48 h-48 mx-auto object-cover rounded-full border-4 border-white/20 shadow-2xl group-hover:border-purple-400/40 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-orbitron font-bold text-white mb-2">Ansab</h2>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-base">
                    <Brain className="w-4 h-4 mr-2" />
                    Chief Technology Officer
                  </Badge>
                </div>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  A visionary technologist with deep expertise in AI and machine learning. Ansab architects 
                  the sophisticated neural networks that power AIShura's contextual understanding and 
                  emotional intelligence capabilities, ensuring every user interaction feels genuinely human.
                </p>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">Expertise</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['AI & Machine Learning', 'Neural Networks', 'Natural Language Processing', 'System Architecture'].map((skill) => (
                      <Badge key={skill} variant="outline" className="border-purple-400/30 text-purple-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 pt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Github className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keon - CEO */}
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-500 hover:scale-105 group">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <img 
                  src="/lovable-uploads/0c4fcd79-cfbf-4058-8e8c-252a57d56c7f.png"
                  alt="Keon - CEO"
                  className="relative w-48 h-48 mx-auto object-cover rounded-full border-4 border-white/20 shadow-2xl group-hover:border-cyan-400/40 transition-all duration-500"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-orbitron font-bold text-white mb-2">Keon</h2>
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 px-4 py-2 text-base">
                    <Rocket className="w-4 h-4 mr-2" />
                    Chief Executive Officer
                  </Badge>
                </div>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  A strategic leader passionate about democratizing career success through AI. Keon drives 
                  AIShura's mission to make personalized career guidance accessible to everyone, combining 
                  business acumen with a deep understanding of professional development challenges.
                </p>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">Expertise</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Strategic Leadership', 'Product Vision', 'Career Development', 'Business Strategy'].map((skill) => (
                      <Badge key={skill} variant="outline" className="border-cyan-400/30 text-cyan-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 pt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Vision */}
        <div className="mt-20 text-center space-y-8">
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 max-w-4xl mx-auto">
            <CardContent className="p-10 space-y-6">
              <h2 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Our Vision
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                We believe that everyone deserves access to intelligent, empathetic career guidance. 
                AIShura represents our commitment to breaking down barriers in professional development, 
                using cutting-edge AI to provide personalized support that adapts to each individual's 
                unique journey, goals, and challenges.
              </p>
              <div className="flex justify-center">
                <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border-white/20 px-6 py-3 text-lg">
                  Empowering Careers Through AI Innovation
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
