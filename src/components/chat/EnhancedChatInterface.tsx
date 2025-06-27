import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { OnboardingFlow } from './OnboardingFlow';
import { supabase } from '@/integrations/supabase/client';

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
}

export const EnhancedChatInterface = ({ user }: EnhancedChatInterfaceProps) => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userPersona, setUserPersona] = useState<UserPersona | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hesitationTimer, setHesitationTimer] = useState<NodeJS.Timeout | null>(null);
  const [deletionCount, setDeletionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  // Enhanced hesitation detection
  useEffect(() => {
    if (inputValue.length > 5) {
      // Clear existing timer
      if (hesitationTimer) clearTimeout(hesitationTimer);
      
      // Set new timer for 3.8 seconds
      const timer = setTimeout(() => {
        showHesitationNudge();
      }, 3800);
      
      setHesitationTimer(timer);
    }

    return () => {
      if (hesitationTimer) clearTimeout(hesitationTimer);
    };
  }, [inputValue]);

  const showHesitationNudge = () => {
    if (!activeSession) return;
    
    const nudges = [
      "I can sense you're taking a thoughtful moment - that's wonderful. 💭 Sometimes the most important thoughts need time to form. Take all the space you need, I'm here with you.",
      "I notice you're being really intentional with your words, and I appreciate that care. 🌟 There's no rush at all - authentic conversations unfold naturally.",
      "It feels like you might be processing something important right now. 💙 That pause shows how much this matters to you. I'm here whenever you're ready to share."
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

    // Track deletions
    if (currentLength < previousLength && previousLength > 3) {
      setDeletionCount(prev => prev + 1);
      
      if (deletionCount > 2) {
        showHesitationNudge();
        setDeletionCount(0);
      }
    }

    setInputValue(value);
  };

  const handleOnboardingComplete = (persona: UserPersona) => {
    setUserPersona(persona);
    setShowOnboarding(false);
    createNewSession();
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

    // Add welcome message
    if (userPersona) {
      const welcomeMessage = getPersonalizedWelcome(userPersona);
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        updateSessionMessages(newSession.id, [aiMessage]);
      }, 500);
    }
  };

  const getPersonalizedWelcome = (persona: UserPersona) => {
    const { name, location, industry, emotionalState } = persona;
    
    if (emotionalState.includes('Anxious')) {
      return `Hello ${name}! 💙 I deeply understand that career anxiety you're experiencing in ${location} - it shows how much your future in ${industry} matters to you. Those feelings are completely valid, and I'm here to transform uncertainty into confident action.

**⚡ Time to Act Now:**
• Explore ${industry} opportunities near you on [LinkedIn Jobs](https://linkedin.com/jobs)
• Build confidence with industry-specific courses on [Coursera](https://coursera.org)
• Research ${industry} companies in ${location} on [Glassdoor](https://glassdoor.com)

What's one small career step in ${industry} that would feel manageable today?`;
    } else if (emotionalState.includes('Excited')) {
      return `Hello brilliant ${name}! ✨ Your excitement about your ${industry} career is absolutely infectious and the perfect fuel for creating extraordinary momentum in ${location}. I'm here to help you channel this beautiful energy strategically.

**⚡ Time to Act Now:**
• Capitalize on momentum with ${industry} startups on [AngelList](https://angel.co/jobs)
• Master cutting-edge ${industry} skills on [Coursera](https://coursera.org)
• Network with ${industry} professionals in ${location} on [LinkedIn](https://linkedin.com)

What ${industry} opportunity would make your heart race with excitement?`;
    } else {
      return `Welcome to your personalized career journey, ${name}! 🌟 I'm AIShura, and I'm genuinely honored to be part of your professional transformation in ${industry} here in ${location} with the care and intelligence you deserve.

**⚡ Time to Act Now:**
• Explore ${industry} opportunities in ${location} on [LinkedIn Jobs](https://linkedin.com/jobs)
• Develop ${industry} skills on [Coursera](https://coursera.org)
• Connect with ${industry} professionals on [LinkedIn](https://linkedin.com)

What's the strongest emotion driving your ${industry} career decisions right now?`;
    }
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            messages,
            lastMessage: messages[messages.length - 1]?.content || '',
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
        content: data.response || "I'm here to support your career journey with genuine care. What's one career emotion you're experiencing right now? 💙",
        sender: 'ai',
        timestamp: new Date()
      };

      updateSessionMessages(activeSessionId, [...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand technical hiccups can be frustrating, but your career growth continues! 💙 Let's focus on action while I reconnect.

**⚡ Time to Act Now:**
• Explore opportunities on [LinkedIn Jobs](https://linkedin.com/jobs)
• Build skills on [Coursera](https://coursera.org)
• Network strategically on [LinkedIn](https://linkedin.com)

What career goal excites you most right now?`,
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
    <div className="h-full flex bg-background">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={setActiveSessionId}
        onNewSession={createNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-cosmic-500/20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                  alt="AIShura" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="bg-cosmic-500/10 border border-cosmic-500/20 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-aurora-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-cosmic-500/20 bg-gradient-to-r from-cosmic-900/10 to-aurora-900/10">
          <div className="flex gap-4">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your career thoughts and emotions with me..."
              className="flex-1 h-12 px-4 bg-background/50 border-cosmic-500/30 focus:border-aurora-500 rounded-xl"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white h-12 px-6 rounded-xl"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
