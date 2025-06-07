
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, User, Sparkles, Brain, Target, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatInterfaceProps {
  user: any;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isNudge?: boolean;
  isPersonaQuestion?: boolean;
}

interface UserPersona {
  careerStage: string;
  goals: string[];
  challenges: string[];
  personality: string;
  experience: string;
}

export const ChatInterface = ({ user }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deletionCount, setDeletionCount] = useState(0);
  const [hasShownNudge, setHasShownNudge] = useState(false);
  const [showPersonaBuilder, setShowPersonaBuilder] = useState(true);
  const [userPersona, setUserPersona] = useState<UserPersona>({
    careerStage: '',
    goals: [],
    challenges: [],
    personality: '',
    experience: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nudgeTimeoutRef = useRef<NodeJS.Timeout>();

  const personaQuestions = [
    {
      question: "What stage of your career journey are you in right now?",
      options: ["Just starting out", "Early career (1-3 years)", "Mid-career (3-7 years)", "Senior level (7+ years)", "Career transition"],
      key: "careerStage"
    },
    {
      question: "What are your main career goals? (Select all that apply)",
      options: ["Land a new job", "Get promoted", "Switch careers", "Improve skills", "Build network", "Start own business"],
      key: "goals",
      multiple: true
    },
    {
      question: "What challenges are you facing? (Select all that apply)",
      options: ["Lack of experience", "Interview anxiety", "Resume concerns", "Networking difficulties", "Work-life balance", "Imposter syndrome"],
      key: "challenges",
      multiple: true
    },
    {
      question: "How would you describe your personality?",
      options: ["Analytical and detail-oriented", "Creative and innovative", "People-focused and collaborative", "Results-driven and competitive", "Adaptable and flexible"],
      key: "personality"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!showPersonaBuilder) {
      const initialMessage: Message = {
        id: '1',
        content: getPersonalizedGreeting(),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [showPersonaBuilder, userPersona]);

  // Hesitation detection system
  useEffect(() => {
    if (inputValue.length > 5) {
      // Clear existing timeout
      if (nudgeTimeoutRef.current) {
        clearTimeout(nudgeTimeoutRef.current);
      }

      // Set new timeout for hesitation detection
      if (!hasShownNudge) {
        nudgeTimeoutRef.current = setTimeout(() => {
          if (inputValue.length > 0) {
            showHesitationNudge();
          }
        }, 8000); // 8 seconds of inactivity
      }
    }

    return () => {
      if (nudgeTimeoutRef.current) {
        clearTimeout(nudgeTimeoutRef.current);
      }
    };
  }, [inputValue, hasShownNudge]);

  const handlePersonaAnswer = (answer: string | string[], isMultiple = false) => {
    const updatedPersona = { ...userPersona };
    const question = personaQuestions[currentQuestion];
    
    if (isMultiple) {
      updatedPersona[question.key as keyof UserPersona] = answer as string[];
    } else {
      updatedPersona[question.key as keyof UserPersona] = answer as string;
    }
    
    setUserPersona(updatedPersona);
    
    if (currentQuestion < personaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowPersonaBuilder(false);
    }
  };

  const getPersonalizedGreeting = () => {
    const { careerStage, goals, challenges } = userPersona;
    
    return `Hello ${user.name}! 🌟 I'm AIShura, and I'm genuinely excited to be your career companion. 

Based on what you've shared - being in the ${careerStage} stage and focusing on ${goals.join(' and ')} - I can already see the potential in your journey.

${challenges.length > 0 ? `I notice you're working through some ${challenges.join(' and ')} challenges. That's completely normal and shows real self-awareness - the first step toward meaningful growth.` : ''}

Your career story is unique, and together we'll transform every challenge into a stepping stone toward your goals. I'm here not just to provide information, but to understand your emotions, celebrate your wins, and guide you through every step.

So, what's really on your mind about your career today? Let's start this conversation wherever feels most comfortable for you. 💙`;
  };

  const handleInputChange = (value: string) => {
    const previousLength = inputValue.length;
    const currentLength = value.length;

    if (currentLength < previousLength && previousLength > 5) {
      setDeletionCount(prev => prev + 1);
      
      if (deletionCount > 3 && !hasShownNudge) {
        showHesitationNudge();
      }
    }

    setInputValue(value);
  };

  const showHesitationNudge = () => {
    const nudgeMessages = [
      "I notice you might be taking a moment to think. That's perfectly okay - finding the right words is part of the process. We're in this together! 💭",
      "It's completely natural to feel uncertain about what to ask. Sometimes the hardest part is just getting started. How about we begin with how you're feeling about your career today? 🤗",
      "I sense a little hesitation. No pressure at all! Remember, there are no wrong questions here. Take your time, and let's start with whatever feels comfortable. 💚",
      "When you pause like this, it's not avoidance - it's your mind processing. That's actually really valuable. What's one small thing about your career that's been on your mind? ✨"
    ];

    const randomNudge = nudgeMessages[Math.floor(Math.random() * nudgeMessages.length)];
    
    const nudgeMessage: Message = {
      id: Date.now().toString(),
      content: randomNudge,
      sender: 'ai',
      timestamp: new Date(),
      isNudge: true
    };

    setMessages(prev => [...prev, nudgeMessage]);
    setHasShownNudge(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    setHasShownNudge(false);
    setDeletionCount(0);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageContent,
          userContext: {
            name: user.name,
            trustScore: user.trustScore,
            persona: userPersona,
            level: user.level,
            xp: user.xp
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm here to support you on your career journey. What would you like to explore together?",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing a brief technical moment, but that won't stop us from making progress together. What's one thing about your career that's been on your mind lately? 💙",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showPersonaBuilder) {
    const currentQ = personaQuestions[currentQuestion];
    
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl glass-effect border-cosmic-500/20 animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cosmic-500 to-aurora-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-orbitron text-gradient">Building Your AIShura Profile</CardTitle>
            <p className="text-muted-foreground">Help me understand you better so I can provide the most personalized guidance</p>
            <div className="flex gap-2 justify-center mt-4">
              {personaQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentQuestion ? 'bg-cosmic-500' : 'bg-cosmic-500/20'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-semibold text-center">{currentQ.question}</h3>
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4 glass-effect border-cosmic-500/30 hover:border-cosmic-500 hover:bg-cosmic-500/10 transition-all duration-300"
                  onClick={() => handlePersonaAnswer(option, currentQ.multiple)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cosmic-400"></div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Enhanced Chat Header */}
      <div className="glass-effect border border-cosmic-500/20 rounded-t-xl p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cosmic-500 to-aurora-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-orbitron text-xl font-bold text-gradient">AIShura Career Guide</h3>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="bg-cosmic-500/20 text-cosmic-400 border-cosmic-500/30">
                <Brain className="w-3 h-3 mr-1" />
                {user.trustScore <= 30 ? 'Empathetic Mode' : user.trustScore <= 70 ? 'Practical Mode' : 'Strategic Mode'}
              </Badge>
              <Badge variant="outline" className="border-aurora-500/30 text-aurora-400">
                <Target className="w-3 h-3 mr-1" />
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="border-neon-500/30 text-neon-400">
                <Zap className="w-3 h-3 mr-1" />
                {user.xp} XP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 glass-effect border-x border-cosmic-500/20 p-6 overflow-y-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <Avatar className="w-10 h-10 border-2 border-cosmic-500/30">
              <AvatarFallback className={message.sender === 'user' ? 'bg-neon-500/20 text-neon-400' : 'bg-cosmic-500/20 text-cosmic-400'}>
                {message.sender === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-neon-500/20 to-neon-600/20 border border-neon-500/30'
                    : message.isNudge
                    ? 'bg-gradient-to-br from-aurora-500/20 to-aurora-600/20 border border-aurora-500/30'
                    : 'bg-gradient-to-br from-cosmic-500/20 to-cosmic-600/20 border border-cosmic-500/30'
                } backdrop-blur-sm`}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              <p className="text-xs text-muted-foreground mt-2 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-4 animate-fade-in">
            <Avatar className="w-10 h-10 border-2 border-cosmic-500/30">
              <AvatarFallback className="bg-cosmic-500/20 text-cosmic-400">
                <Sparkles className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-br from-cosmic-500/20 to-cosmic-600/20 border border-cosmic-500/30 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="glass-effect border border-cosmic-500/20 rounded-b-xl p-6">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind about your career..."
            className="flex-1 glass-effect border-cosmic-500/30 focus:border-cosmic-500 bg-background/50 backdrop-blur-sm h-12 px-4 rounded-xl"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white h-12 px-6 rounded-xl shadow-lg transition-all duration-300"
          >
            <span className="font-medium">Send</span>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            💡 AIShura detects hesitation and provides gentle guidance when you need it most
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span>AI Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
