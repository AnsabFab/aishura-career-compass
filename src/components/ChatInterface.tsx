
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Circle, User } from 'lucide-react';

interface ChatInterfaceProps {
  user: any;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isNudge?: boolean;
}

export const ChatInterface = ({ user }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const [deletionCount, setDeletionCount] = useState(0);
  const [hasShownNudge, setHasShownNudge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nudgeTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial AI greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      content: getPersonalizedGreeting(user.trustScore),
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [user.trustScore]);

  // Hesitation detection system
  useEffect(() => {
    if (inputValue.length > 5) {
      setLastTypingTime(Date.now());
    }

    // Clear existing timeout
    if (nudgeTimeoutRef.current) {
      clearTimeout(nudgeTimeoutRef.current);
    }

    // Set new timeout for hesitation detection
    if (inputValue.length > 0 && !hasShownNudge) {
      nudgeTimeoutRef.current = setTimeout(() => {
        if (inputValue.length > 0) {
          showHesitationNudge();
        }
      }, 10000); // 10 seconds of inactivity
    }

    return () => {
      if (nudgeTimeoutRef.current) {
        clearTimeout(nudgeTimeoutRef.current);
      }
    };
  }, [inputValue, hasShownNudge]);

  // Detect rapid deletion
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

  const getPersonalizedGreeting = (trustScore: number) => {
    if (trustScore <= 30) {
      return `Hello ${user.name}! 🌟 I'm AIShura, your empathetic career companion. I'm here to support you through every step of your journey. How are you feeling about your career today?`;
    } else if (trustScore <= 70) {
      return `Welcome back, ${user.name}! Ready to tackle some career challenges today? I've been thinking about our last conversation and have some practical next steps for you.`;
    } else {
      return `Great to see you again, ${user.name}! Let's dive into some strategic career planning. Based on your progress, I think you're ready for the next level. What ambitious goal shall we work on today?`;
    }
  };

  const showHesitationNudge = () => {
    const nudgeMessages = [
      "I notice you might be taking a moment to think. That's perfectly okay - finding the right words is part of the process. We're in this together! 💭",
      "It's completely natural to feel uncertain about what to ask. Sometimes the hardest part is just getting started. How about we begin with how you're feeling about your career today? 🤗",
      "I sense a little hesitation. No pressure at all! Remember, there are no wrong questions here. Take your time, and let's start with whatever feels comfortable. 💚",
      "Feeling stuck on what to say? That's actually very common! Even small steps count. Maybe we can start with: What's one thing about your career that's been on your mind lately? ✨"
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
    setInputValue('');
    setIsTyping(true);
    setHasShownNudge(false);
    setDeletionCount(0);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue.trim(), user.trustScore);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, trustScore: number) => {
    const lowerInput = userInput.toLowerCase();
    
    // Action-oriented responses with embedded links
    if (lowerInput.includes('job') || lowerInput.includes('career') || lowerInput.includes('work')) {
      return `I understand you're thinking about your career path! Based on our conversation, I've found some relevant opportunities that align with your interests: <a href="https://www.linkedin.com/jobs/" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">LinkedIn Job Board</a> and <a href="https://www.indeed.com/" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">Indeed Career Opportunities</a>. 

      Additionally, there's a <a href="https://www.eventbrite.com/d/online/career-fair/" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">virtual career fair happening next week</a> that could be perfect for networking! 

      What specific type of role interests you most? Let's narrow down the search and create an action plan! 🚀`;
    }

    if (lowerInput.includes('stuck') || lowerInput.includes('confused') || lowerInput.includes('lost')) {
      return `Feeling stuck is completely normal and actually shows self-awareness - that's the first step toward growth! 🌱 

      Let's break this down together. I recommend starting with this <a href="https://www.16personalities.com/free-personality-test" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">career personality assessment</a> to gain clarity on your strengths.

      Also, here's a <a href="https://www.coursera.org/articles/how-to-find-your-career-path" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">step-by-step career path guide</a> I think you'll find helpful.

      What's one small thing you could do today to feel more confident about your direction?`;
    }

    if (lowerInput.includes('interview') || lowerInput.includes('resume')) {
      return `Great that you're preparing for the next step! 📝 Here are some immediate resources:

      • <a href="https://www.canva.com/resumes/templates/" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">Professional resume templates</a> to make your application stand out
      • <a href="https://www.glassdoor.com/Interview/index.htm" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">Interview preparation guide</a> with common questions
      • <a href="https://www.linkedin.com/learning/paths/improve-your-interviewing-skills" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">LinkedIn interview skills course</a>

      I'd also suggest scheduling a <a href="https://www.pramp.com/" target="_blank" class="text-cosmic-400 hover:text-cosmic-300 underline">free mock interview session</a> to practice.

      What position are you applying for? Let's tailor your preparation strategy!`;
    }

    // Trustscore-based responses
    if (trustScore <= 30) {
      return `Thank you for sharing that with me. I can sense this is important to you, and I want you to know that every feeling you're experiencing is valid. 

      Career transitions can feel overwhelming, but you don't have to figure it all out at once. Let's take it one step at a time. 

      What would feel like a small, manageable next step for you right now? 💙`;
    } else if (trustScore <= 70) {
      return `I appreciate you being direct about this. Based on what you've told me, here's what I think we should focus on:

      1. Immediate actions you can take this week
      2. Resources that match your current situation
      3. A realistic timeline for your goals

      Your consistency in our conversations shows you're serious about making progress. Let's channel that energy into concrete steps. What feels most urgent to address first?`;
    } else {
      return `Excellent question - you're thinking strategically now! This shows real growth in how you approach career challenges.

      Let me give you an advanced framework to consider: This situation requires both tactical execution and strategic positioning. I recommend you leverage this opportunity to also strengthen your professional network.

      Here's my suggested approach: [specific actionable steps]. You're ready for this level of complexity. What's your timeline for implementation?`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Chat Header */}
      <div className="glass-effect border border-cosmic-500/20 rounded-t-xl p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cosmic-500 to-aurora-500 rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AIShura Career Guide</h3>
            <p className="text-xs text-muted-foreground">
              Trust Level: {user.trustScore <= 30 ? 'Cheerful' : user.trustScore <= 70 ? 'Practical' : 'Strategic'} • Always here to help
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass-effect border-x border-cosmic-500/20 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className={message.sender === 'user' ? 'bg-neon-500/20 text-neon-400' : 'bg-cosmic-500/20 text-cosmic-400'}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : 'AI'}
              </AvatarFallback>
            </Avatar>
            
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-3 rounded-xl ${
                  message.sender === 'user'
                    ? 'bg-neon-500/20 border border-neon-500/30'
                    : message.isNudge
                    ? 'bg-aurora-500/20 border border-aurora-500/30'
                    : 'bg-cosmic-500/20 border border-cosmic-500/30'
                }`}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3 animate-fade-in">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-cosmic-500/20 text-cosmic-400">AI</AvatarFallback>
            </Avatar>
            <div className="bg-cosmic-500/20 border border-cosmic-500/30 p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-effect border border-cosmic-500/20 rounded-b-xl p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind about your career..."
            className="flex-1 glass-effect border-cosmic-500/30 focus:border-cosmic-500"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-cosmic-600 hover:bg-cosmic-700 text-white"
          >
            Send
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: AIShura detects hesitation and provides gentle guidance when you need it most
        </p>
      </div>
    </div>
  );
};
