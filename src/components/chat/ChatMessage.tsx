import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Copy, ExternalLink, Zap, Globe } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isNudge?: boolean;
}

export const ChatMessage = ({ content, sender, timestamp, isNudge }: ChatMessageProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const renderContent = (text: string) => {
    const timeToActMatch = text.match(/⚡ Time to Act Now:\s*([\s\S]*?)(?=\n\n|\n*$)/);
    const beforeTimeToAct = timeToActMatch ? text.substring(0, timeToActMatch.index) : text;
    const timeToActContent = timeToActMatch ? timeToActMatch[1] : '';
    const afterTimeToAct = timeToActMatch ? text.substring(timeToActMatch.index! + timeToActMatch[0].length) : '';

    const renderTextWithLinks = (textContent: string) => {
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
      const parts = textContent.split(linkRegex);
      
      return parts.map((part, index) => {
        if (index % 3 === 1) {
          const url = parts[index + 1];
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 ai-glass-effect border border-purple-400/30 rounded-lg text-purple-300 hover:border-purple-300 transition-all duration-200 font-medium text-sm mx-1"
            >
              {part}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        } else if (index % 3 === 2) {
          return null;
        }
        
        return <span key={index}>{part}</span>;
      });
    };

    const renderTimeToActAction = (content: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/;
      const urlMatch = content.match(urlRegex);
      
      if (!urlMatch) {
        return <div className="text-sm text-gray-300">{content.replace('•', '').trim()}</div>;
      }

      const url = urlMatch[1];
      const actionText = content.replace(urlRegex, '').replace('•', '').trim();
      
      let buttonText = "Take Action";
      let buttonIcon = Globe;
      
      if (actionText.toLowerCase().includes('interview') || actionText.toLowerCase().includes('prep')) {
        buttonText = "Prepare Now";
        buttonIcon = Zap;
      } else if (actionText.toLowerCase().includes('job') || actionText.toLowerCase().includes('opportunit')) {
        buttonText = "Find Jobs";
        buttonIcon = Globe;
      } else if (actionText.toLowerCase().includes('skill') || actionText.toLowerCase().includes('course') || actionText.toLowerCase().includes('learn')) {
        buttonText = "Learn Skills";
        buttonIcon = Zap;
      } else if (actionText.toLowerCase().includes('network') || actionText.toLowerCase().includes('connect')) {
        buttonText = "Network Now";
        buttonIcon = Globe;
      } else if (actionText.toLowerCase().includes('research') || actionText.toLowerCase().includes('explore')) {
        buttonText = "Explore Now";
        buttonIcon = Globe;
      }

      const ButtonIcon = buttonIcon;

      return (
        <div className="ai-glass-effect border border-purple-400/30 rounded-2xl p-5 hover:border-purple-300/40 transition-all duration-300 ai-card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-white font-medium mb-2 leading-relaxed">
                {actionText}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                Ready to take action • Contextually matched for you
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 ai-button-glow px-5 py-3 text-white rounded-xl transition-all duration-200 font-medium text-sm whitespace-nowrap"
            >
              <ButtonIcon className="w-4 h-4" />
              {buttonText}
            </a>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-5">
        {beforeTimeToAct && (
          <div className="whitespace-pre-wrap leading-relaxed text-base text-gray-200">
            {renderTextWithLinks(beforeTimeToAct)}
          </div>
        )}

        {timeToActContent && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white animate-pulse" />
              </div>
              <span className="font-bold ai-glow-text text-lg font-orbitron">Time to Act Now</span>
            </div>
            <div className="space-y-3">
              {renderTimeToActAction(timeToActContent)}
            </div>
          </div>
        )}

        {afterTimeToAct && (
          <div className="whitespace-pre-wrap leading-relaxed text-base text-gray-200">
            {renderTextWithLinks(afterTimeToAct)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-4 ${sender === 'user' ? 'flex-row-reverse' : ''} group animate-fade-in-up`}>
      <Avatar className="w-12 h-12 border-2 border-purple-400/30 ai-glass-effect">
        <AvatarFallback className={sender === 'user' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}>
          {sender === 'user' ? (
            <User className="w-6 h-6" />
          ) : (
            <img 
              src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
              alt="AIShura" 
              className="w-6 h-6 object-contain"
            />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={`max-w-[85%] ${sender === 'user' ? 'text-right' : ''}`}>
        <div
          className={`p-6 rounded-2xl leading-relaxed text-base relative overflow-hidden ${
            sender === 'user'
              ? 'ai-glass-effect border border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5'
              : isNudge
              ? 'ai-glass-effect border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5'
              : 'ai-message-bubble border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-blue-500/5'
          } backdrop-blur-xl shadow-2xl ai-card-hover`}
        >
          {renderContent(content)}
          
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 hover:bg-white/10"
            onClick={copyToClipboard}
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 px-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
