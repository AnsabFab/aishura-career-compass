import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, User, Sparkles, Brain, Target, Zap, Heart, Star } from 'lucide-react';
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
  emotionalState: string;
}

export const ChatInterface = ({ user }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hesitationMetrics, setHesitationMetrics] = useState({
    deletionCount: 0,
    pauseCount: 0,
    retypeCount: 0,
    lastActivity: Date.now()
  });
  const [hasShownNudge, setHasShownNudge] = useState(false);
  const [showPersonaBuilder, setShowPersonaBuilder] = useState(true);
  const [userPersona, setUserPersona] = useState<UserPersona>({
    careerStage: '',
    goals: [],
    challenges: [],
    personality: '',
    emotionalState: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hesitationTimeoutRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();

  const personaQuestions = [
    {
      question: "Welcome to AIShura! ✨ What stage of your career journey are you in?",
      options: ["🌱 Just starting out", "🚀 Early career (1-3 years)", "💼 Mid-career (3-7 years)", "👑 Senior level (7+ years)", "🔄 Career transition"],
      key: "careerStage" as keyof UserPersona
    },
    {
      question: "What career goals light up your soul? (Select all that resonate)",
      options: ["🎯 Land my dream job", "📈 Get promoted", "🔄 Switch careers", "💡 Master new skills", "🤝 Build my network", "🚀 Start my own business"],
      key: "goals" as keyof UserPersona,
      multiple: true
    },
    {
      question: "What challenges are you facing on this journey? (Select all that apply)",
      options: ["📝 Lack of experience", "😰 Interview anxiety", "📄 Resume concerns", "🤝 Networking difficulties", "⚖️ Work-life balance", "🎭 Imposter syndrome"],
      key: "challenges" as keyof UserPersona,
      multiple: true
    },
    {
      question: "How would you describe your unique personality?",
      options: ["🔍 Analytical & detail-oriented", "🎨 Creative & innovative", "👥 People-focused & collaborative", "🏆 Results-driven & competitive", "🌊 Adaptable & flexible"],
      key: "personality" as keyof UserPersona
    },
    {
      question: "How are you feeling emotionally about your career right now?",
      options: ["😊 Excited & motivated", "😟 Anxious & worried", "😤 Frustrated & stuck", "🤔 Hopeful but uncertain", "😵 Overwhelmed & stressed", "💪 Confident & ready"],
      key: "emotionalState" as keyof UserPersona
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

  // Advanced hesitation detection system
  useEffect(() => {
    if (inputValue.length > 3) {
      setHesitationMetrics(prev => ({ ...prev, lastActivity: Date.now() }));
      
      // Clear existing timeouts
      if (hesitationTimeoutRef.current) clearTimeout(hesitationTimeoutRef.current);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);

      // Detect long pauses (6 seconds)
      if (!hasShownNudge) {
        hesitationTimeoutRef.current = setTimeout(() => {
          if (inputValue.length > 0) {
            setHesitationMetrics(prev => ({ ...prev, pauseCount: prev.pauseCount + 1 }));
            showAdvancedHesitationNudge('pause');
          }
        }, 6000);

        // Detect extended inactivity (12 seconds)
        activityTimeoutRef.current = setTimeout(() => {
          if (inputValue.length > 0) {
            showAdvancedHesitationNudge('extended');
          }
        }, 12000);
      }
    }

    return () => {
      if (hesitationTimeoutRef.current) clearTimeout(hesitationTimeoutRef.current);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [inputValue, hasShownNudge]);

  const handlePersonaAnswer = (answer: string | string[], isMultiple = false) => {
    const updatedPersona = { ...userPersona };
    const question = personaQuestions[currentQuestion];
    
    if (isMultiple && Array.isArray(answer)) {
      (updatedPersona[question.key] as string[]) = answer;
    } else if (!isMultiple && typeof answer === 'string') {
      (updatedPersona[question.key] as string) = answer;
    }
    
    setUserPersona(updatedPersona);
    
    if (currentQuestion < personaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowPersonaBuilder(false);
    }
  };

  const getPersonalizedGreeting = () => {
    const { careerStage, emotionalState } = userPersona;
    
    let actionLinks = '';
    let emotionalResponse = '';
    
    // More precise emotional adaptation
    if (emotionalState.includes('Anxious')) {
      emotionalResponse = "I understand that career anxiety - it shows how much this matters to you. 💙 Those feelings are completely valid.";
      actionLinks = 'Start small: explore [opportunities on LinkedIn](https://linkedin.com/jobs) and build confidence with [courses on Coursera](https://coursera.org).';
    } else if (emotionalState.includes('Frustrated')) {
      emotionalResponse = "I feel that frustration with you - it's energy ready to be channeled into positive action. 🔥";
      actionLinks = 'Take action now: discover [new roles on Indeed](https://indeed.com) and advance skills on [Khan Academy](https://khanacademy.org).';
    } else if (emotionalState.includes('Excited')) {
      emotionalResponse = "Your excitement is inspiring! ✨ Let's harness that energy for real career momentum.";
      actionLinks = 'Capitalize now: explore [exciting startups on AngelList](https://angel.co/jobs) and master skills on [Coursera](https://coursera.org).';
    } else {
      emotionalResponse = "I see the mix of emotions you're navigating - that's completely human. 🌟";
      actionLinks = 'Move forward: research [companies on Glassdoor](https://glassdoor.com) and grow with [LinkedIn Learning](https://linkedin.com/learning).';
    }
    
    return `Hello! I'm AIShura, your career companion. ✨

${emotionalResponse}

${actionLinks}

What's the strongest emotion driving your career decisions right now?`;
  };

  const handleInputChange = (value: string) => {
    const previousLength = inputValue.length;
    const currentLength = value.length;

    // Detect deletions and retypes
    if (currentLength < previousLength && previousLength > 5) {
      setHesitationMetrics(prev => ({ 
        ...prev, 
        deletionCount: prev.deletionCount + 1 
      }));
      
      if (hesitationMetrics.deletionCount > 2 && !hasShownNudge) {
        showAdvancedHesitationNudge('deletion');
      }
    }

    // Detect retyping patterns
    if (currentLength > 0 && previousLength === 0 && hesitationMetrics.retypeCount > 0) {
      setHesitationMetrics(prev => ({ 
        ...prev, 
        retypeCount: prev.retypeCount + 1 
      }));
    }

    setInputValue(value);
  };

  const showAdvancedHesitationNudge = (type: 'pause' | 'deletion' | 'extended') => {
    const nudgeMessages = {
      pause: [
        "I notice you're taking a thoughtful pause - that shows such wisdom! 💭 Sometimes the most important thoughts need time to form. I'm here whenever you're ready to share.",
        "It's beautiful how you're being mindful with your words. 🤗 There's no rush at all - authentic conversations take time. What's stirring in your heart about your career?",
        "I feel you processing something important right now. 💚 That pause tells me you care deeply about getting this right. Take all the space you need - I'm here with you."
      ],
      deletion: [
        "I see you're crafting your thoughts carefully - that's such a thoughtful approach! ✨ Sometimes the right words need a few tries. Your authentic voice is what matters most.",
        "It's okay to search for the perfect words - your story deserves to be told just right! 🌟 I'm patient and here to listen to whatever feels true for you.",
        "I notice you're being intentional with your message. That consideration shows how much this matters to you! 💙 Take your time - authentic sharing can't be rushed."
      ],
      extended: [
        "I'm sensing you might be feeling a bit overwhelmed right now, and that's completely okay! 🤗 Career conversations can bring up so many emotions. Remember, I'm here to support you, not pressure you.",
        "Sometimes the biggest career questions need the longest pauses. 💭 Your thoughtfulness is a strength, not a delay. What's one small thing about your career journey you'd like to explore?",
        "I feel you might be processing something deep about your career path. 🌊 That's such important inner work! Would it help to start with just sharing how you're feeling right now?"
      ]
    };

    const typeMessages = nudgeMessages[type];
    const randomNudge = typeMessages[Math.floor(Math.random() * typeMessages.length)];
    
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
    setHesitationMetrics({ deletionCount: 0, pauseCount: 0, retypeCount: 0, lastActivity: Date.now() });

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageContent,
          userContext: {
            name: user.name,
            trustScore: user.trustScore,
            persona: userPersona,
            level: user.level,
            xp: user.xp,
            hesitationData: hesitationMetrics
          }
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm here to support your career journey with genuine care. What's one career emotion you're experiencing right now? 💙",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I feel your frustration with this technical hiccup, but your career growth won't be stopped! 💪 Let's focus on action: explore [LinkedIn Jobs](https://linkedin.com/jobs) and build skills on [Coursera](https://coursera.org). What career goal excites you most?",
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
        <Card className="w-full max-w-3xl glass-effect border-cosmic-500/20 animate-scale-in bg-gradient-to-br from-cosmic-900/10 via-background to-aurora-900/10">
          <CardHeader className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cosmic-500 via-aurora-500 to-neon-500 rounded-full flex items-center justify-center animate-pulse-glow relative">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-12 h-12 object-contain filter brightness-0 invert"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-aurora-400 to-neon-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-orbitron text-gradient bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text">
              Welcome to AIShura ✨
            </CardTitle>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Let's create your personalized career companion experience together
            </p>
            <div className="flex gap-3 justify-center mt-6">
              {personaQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index < currentQuestion ? 'bg-gradient-to-r from-cosmic-500 to-aurora-500' 
                    : index === currentQuestion ? 'bg-gradient-to-r from-aurora-500 to-neon-500 animate-pulse-glow' 
                    : 'bg-cosmic-500/20'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <h3 className="text-xl font-semibold text-center leading-relaxed">{currentQ.question}</h3>
            <div className="grid gap-4 max-w-2xl mx-auto">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-6 glass-effect border-cosmic-500/30 hover:border-aurora-500 hover:bg-gradient-to-r hover:from-cosmic-500/10 hover:to-aurora-500/10 transition-all duration-300 text-left group"
                  onClick={() => handlePersonaAnswer(option, currentQ.multiple)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cosmic-400 to-aurora-400 group-hover:from-aurora-400 group-hover:to-neon-400 transition-all duration-300"></div>
                    <span className="text-base">{option}</span>
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
      {/* Enhanced Futuristic Chat Header */}
      <div className="glass-effect border border-cosmic-500/20 rounded-t-xl p-6 border-b bg-gradient-to-r from-cosmic-900/20 via-background to-aurora-900/20">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-cosmic-500 via-aurora-500 to-neon-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-8 h-8 object-contain filter brightness-0 invert"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-background animate-pulse flex items-center justify-center">
              <Star className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-orbitron text-2xl font-bold text-gradient bg-gradient-to-r from-cosmic-400 via-aurora-400 to-neon-400 bg-clip-text">
              AIShura Career Companion
            </h3>
            <div className="flex items-center gap-6 mt-3">
              <Badge variant="secondary" className="bg-cosmic-500/20 text-cosmic-300 border-cosmic-500/30 px-3 py-1">
                <Brain className="w-3 h-3 mr-2" />
                Emotionally Intelligent
              </Badge>
              <Badge variant="outline" className="border-aurora-500/30 text-aurora-300 px-3 py-1">
                <Target className="w-3 h-3 mr-2" />
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="border-neon-500/30 text-neon-300 px-3 py-1">
                <Zap className="w-3 h-3 mr-2" />
                {user.xp} XP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area with Elegant Styling */}
      <div className="flex-1 glass-effect border-x border-cosmic-500/20 p-6 overflow-y-auto space-y-8 bg-gradient-to-b from-background via-cosmic-900/5 to-aurora-900/5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-5 ${message.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <Avatar className="w-12 h-12 border-2 border-cosmic-500/30">
              <AvatarFallback className={message.sender === 'user' ? 'bg-neon-500/20 text-neon-300' : 'bg-cosmic-500/20 text-cosmic-300'}>
                {message.sender === 'user' ? (
                  <User className="w-6 h-6" />
                ) : (
                  <img 
                    src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                    alt="AIShura" 
                    className="w-6 h-6 object-contain filter brightness-0 invert"
                  />
                )}
              </AvatarFallback>
            </Avatar>
            
            <div className={`max-w-[85%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-5 rounded-2xl leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-neon-500/20 via-neon-600/15 to-neon-700/10 border border-neon-500/30'
                    : message.isNudge
                    ? 'bg-gradient-to-br from-aurora-500/20 via-aurora-600/15 to-aurora-700/10 border border-aurora-500/30'
                    : 'bg-gradient-to-br from-cosmic-500/20 via-cosmic-600/15 to-cosmic-700/10 border border-cosmic-500/30'
                } backdrop-blur-sm shadow-lg`}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              <p className="text-xs text-muted-foreground/70 mt-3 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-5 animate-fade-in">
            <Avatar className="w-12 h-12 border-2 border-cosmic-500/30">
              <AvatarFallback className="bg-cosmic-500/20 text-cosmic-300">
                <img 
                  src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                  alt="AIShura" 
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-br from-cosmic-500/20 via-cosmic-600/15 to-cosmic-700/10 border border-cosmic-500/30 p-5 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="flex gap-2">
                <div className="typing-indicator bg-cosmic-400"></div>
                <div className="typing-indicator bg-aurora-400"></div>
                <div className="typing-indicator bg-neon-400"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Futuristic Input Area */}
      <div className="glass-effect border border-cosmic-500/20 rounded-b-xl p-6 bg-gradient-to-r from-cosmic-900/20 via-background to-aurora-900/20">
        <div className="flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your career thoughts and emotions with me..."
            className="flex-1 glass-effect border-cosmic-500/30 focus:border-aurora-500 bg-background/50 backdrop-blur-sm h-14 px-6 rounded-xl text-base placeholder:text-muted-foreground/60"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-cosmic-600 via-aurora-600 to-neon-600 hover:from-cosmic-700 hover:via-aurora-700 hover:to-neon-700 text-white h-14 px-8 rounded-xl shadow-lg transition-all duration-300 font-medium"
          >
            <span>Send</span>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-muted-foreground/70">
            ✨ AIShura provides emotionally intelligent career guidance with advanced hesitation detection
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
            <span>AI Active & Empathetic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
