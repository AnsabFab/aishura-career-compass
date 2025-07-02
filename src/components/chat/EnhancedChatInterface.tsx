import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { OnboardingFlow } from './OnboardingFlow';
import { MetaHumanBackground } from './MetaHumanBackground';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isNudge?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

interface UserPersona {
  name: string;
  location: string;
  industry: string;
  careerStage: string;
  goals: string[];
  challenges: string[];
  personality: string;
  emotionalState: string;
}

interface EnhancedChatInterfaceProps {
  user: any;
  forceOnboarding?: boolean;
}

export const EnhancedChatInterface = ({ user, forceOnboarding = false }: EnhancedChatInterfaceProps) => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(forceOnboarding || true);
  const [userPersona, setUserPersona] = useState<UserPersona | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hesitationTimer, setHesitationTimer] = useState<NodeJS.Timeout | null>(null);
  const [deletionCount, setDeletionCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [lastTypingTime, setLastTypingTime] = useState<number>(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  // Enhanced hesitation detection
  useEffect(() => {
    if (inputValue.length > 3) {
      if (hesitationTimer) clearTimeout(hesitationTimer);
      
      const timer = setTimeout(() => {
        showHesitationNudge();
      }, 2500); // Reduced from 3800ms
      
      setHesitationTimer(timer);
    }

    return () => {
      if (hesitationTimer) clearTimeout(hesitationTimer);
    };
  }, [inputValue]);

  // Detect typing pauses for hesitation
  useEffect(() => {
    const now = Date.now();
    if (now - lastTypingTime > 1500 && inputValue.length > 5) {
      setPauseCount(prev => prev + 1);
      if (pauseCount > 1) {
        showHesitationNudge();
        setPauseCount(0);
      }
    }
  }, [inputValue, lastTypingTime, pauseCount]);

  const showHesitationNudge = () => {
    if (!activeSession) return;
    
    const nudges = [
      "I can sense you're taking a thoughtful moment - that's wonderful. Sometimes the most important thoughts need time to form. Take all the space you need, I'm here with you. 💭",
      "I notice you're being really intentional with your words, and I appreciate that care. There's no rush at all - authentic conversations unfold naturally. 🌟",
      "It feels like you might be processing something important right now. That pause shows how much this matters to you. I'm here whenever you're ready to share. 💜",
      "I can feel the weight of what you're considering sharing. Those moments of hesitation often hold the most meaningful insights. I'm listening with full presence. 🤗",
      "Your thoughtful pause tells me this conversation matters deeply to you. That's beautiful - take all the time you need to find your words. I'm right here. ✨"
    ];
    
    const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];
    
    const nudgeMessage: Message = {
      id: Date.now().toString(),
      content: randomNudge,
      sender: 'ai',
      timestamp: new Date(),
      isNudge: true
    };

    updateSessionMessages(activeSessionId, [...activeSession.messages, nudgeMessage]);
  };

  const handleInputChange = (value: string) => {
    const previousLength = inputValue.length;
    const currentLength = value.length;
    
    setLastTypingTime(Date.now());

    if (currentLength < previousLength && previousLength > 3) {
      setDeletionCount(prev => prev + 1);
      
      if (deletionCount > 3) { // Increased threshold
        showHesitationNudge();
        setDeletionCount(0);
      }
    }

    setInputValue(value);
  };

  const handleOnboardingComplete = (persona: UserPersona) => {
    setUserPersona(persona);
    setShowOnboarding(false);
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Welcome ${persona.name}`,
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };

    setSessions([newSession]);
    setActiveSessionId(newSession.id);

    setTimeout(() => {
      const welcomeMessage = getPersonalizedWelcome(persona);
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setSessions(prev => prev.map(session => 
        session.id === newSession.id 
          ? { 
              ...session, 
              messages: [aiMessage],
              lastMessage: welcomeMessage.substring(0, 100) + '...',
              title: `Welcome ${persona.name}`
            }
          : session
      ));
    }, 1000);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const getPersonalizedWelcome = (persona: UserPersona) => {
    const { name, location, industry, emotionalState } = persona;
    
    if (emotionalState.includes('Anxious')) {
      return `Hello beautiful ${name}! 🌟 I deeply understand the career uncertainty you're navigating in ${location} - those feelings around ${industry} are completely valid and show how much your future matters to you. I'm here to transform that anxiety into confident, strategic action.

Your emotional awareness is actually a superpower that will serve you incredibly well in ${industry}. Let's channel this energy into meaningful progress that aligns with your authentic goals.

⚡ **Time to Act Now:**
• Build unshakeable confidence in ${industry} with targeted skill development: https://www.coursera.org/browse/${industry.toLowerCase().replace(/\s+/g, '-')}

What specific aspect of your ${industry} journey feels most overwhelming right now? I'm here to walk through it with you, step by step. 💪✨`;
    } else if (emotionalState.includes('Excited')) {
      return `Hello brilliant ${name}! 🚀 Your excitement about ${industry} is absolutely infectious and the perfect foundation for extraordinary career momentum in ${location}. I'm here to help you strategically channel this beautiful energy.

Your enthusiasm combined with smart strategy will create incredible opportunities in ${industry}. Let's turn this excitement into concrete, actionable steps that accelerate your success.

⚡ **Time to Act Now:**
• Leverage your momentum in ${industry} by exploring cutting-edge opportunities: https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}

What ${industry} opportunity would make your heart race with even more excitement? Let's make it happen! 🔥💫`;
    } else {
      return `Welcome to your personalized career transformation, ${name}! 🌟 I'm AIShura, and I'm genuinely honored to guide your professional journey in ${industry} here in ${location}. Let's create something extraordinary together.

Your unique blend of skills and aspirations in ${industry} has incredible potential. I'm here to provide precise, emotionally intelligent guidance that resonates with your authentic career vision.

⚡ **Time to Act Now:**
• Discover ${industry} opportunities tailored to your background: https://www.indeed.com/jobs?q=${encodeURIComponent(industry)}&l=${encodeURIComponent(location)}

What's driving your passion for ${industry} right now? I'm excited to hear your story! 💼✨`;
    }
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            messages,
            lastMessage: messages[messages.length - 1]?.content.substring(0, 100) + '...' || '',
            title: messages.length === 1 ? generateSessionTitle(messages[0].content) : session.title
          }
        : session
    ));
  };

  const generateSessionTitle = (firstMessage: string) => {
    const words = firstMessage.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.substring(0, 27) + '...' : words;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...activeSession.messages, userMessage];
    updateSessionMessages(activeSessionId, updatedMessages);

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    setDeletionCount(0);
    setPauseCount(0);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageContent,
          userContext: {
            name: userPersona?.name || user.name,
            location: userPersona?.location || '',
            industry: userPersona?.industry || '',
            persona: userPersona,
            level: user.level,
            xp: user.xp
          },
          sessionId: activeSessionId
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm here to support your career journey with genuine care and precise guidance. What specific career challenge would you like to address?",
        sender: 'ai',
        timestamp: new Date()
      };

      updateSessionMessages(activeSessionId, [...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand technical hiccups can be frustrating, but your career growth continues! Let's focus on actionable steps while I reconnect.

⚡ **Time to Act Now:**
• Continue building momentum: https://www.linkedin.com/jobs

What career goal excites you most right now? 🚀✨`,
        sender: 'ai',
        timestamp: new Date()
      };
      updateSessionMessages(activeSessionId, [...updatedMessages, fallbackMessage]);
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

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (sessionId === activeSessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining[0]?.id || '');
    }
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, title: newTitle } : session
    ));
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-full flex bg-transparent relative overflow-hidden">
      <MetaHumanBackground />
      
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewSession={createNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      
      <div className="flex-1 flex flex-col relative z-10">
        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeSession?.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              isNudge={message.isNudge}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-6 animate-fade-in-up">
              <div className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center border border-purple-400/30">
                <img 
                  src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                  alt="AIShura" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <div className="flex gap-2">
                  <div className="ai-typing-indicator"></div>
                  <div className="ai-typing-indicator"></div>
                  <div className="ai-typing-indicator"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="p-8 bg-black/20 backdrop-blur-xl border-t border-white/10">
          <div className="flex gap-6 items-end">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your career thoughts with AIShura..."
              className="flex-1 h-16 px-8 bg-white/5 backdrop-blur-xl border-2 border-white/20 focus:border-purple-400 text-white placeholder:text-gray-400 text-lg rounded-2xl"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 h-16 px-8 rounded-2xl font-semibold text-white border-0 shadow-lg"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center mt-6">
            <p className="text-sm text-gray-400 flex items-center gap-3">
              <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></span>
              AIShura • Advanced Emotional Intelligence Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
