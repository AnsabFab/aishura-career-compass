
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Copy, ExternalLink, Zap } from 'lucide-react';

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
    // Split content into sections
    const timeToActMatch = text.match(/⚡ Time to Act Now:\s*([\s\S]*?)(?=\n\n|\n*$)/);
    const beforeTimeToAct = timeToActMatch ? text.substring(0, timeToActMatch.index) : text;
    const timeToActContent = timeToActMatch ? timeToActMatch[1] : '';
    const afterTimeToAct = timeToActMatch ? text.substring(timeToActMatch.index! + timeToActMatch[0].length) : '';

    const renderTextWithLinks = (textContent: string) => {
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
      const parts = textContent.split(linkRegex);
      
      return parts.map((part, index) => {
        if (index % 3 === 1) {
          // This is link text
          const url = parts[index + 1];
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cosmic-500/20 to-aurora-500/20 border border-cosmic-500/30 rounded-lg text-cosmic-300 hover:from-cosmic-500/30 hover:to-aurora-500/30 hover:border-cosmic-400 transition-all duration-200 font-medium"
            >
              {part}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        } else if (index % 3 === 2) {
          // This is the URL, skip it as we've already used it
          return null;
        }
        
        return <span key={index}>{part}</span>;
      });
    };

    const renderTimeToActAction = (content: string) => {
      // Extract the main action text and URL
      const urlRegex = /(https?:\/\/[^\s]+)/;
      const urlMatch = content.match(urlRegex);
      
      if (!urlMatch) {
        return <div className="text-sm">{content.replace('•', '').trim()}</div>;
      }

      const url = urlMatch[1];
      const actionText = content.replace(urlRegex, '').replace('•', '').trim();
      
      // Generate action button text based on content
      let buttonText = "Take Action";
      if (actionText.toLowerCase().includes('job') || actionText.toLowerCase().includes('opportunit')) {
        buttonText = "Find Jobs";
      } else if (actionText.toLowerCase().includes('skill') || actionText.toLowerCase().includes('course')) {
        buttonText = "Learn Skills";
      } else if (actionText.toLowerCase().includes('network') || actionText.toLowerCase().includes('connect')) {
        buttonText = "Network Now";
      } else if (actionText.toLowerCase().includes('research') || actionText.toLowerCase().includes('explore')) {
        buttonText = "Explore Now";
      }

      return (
        <div className="bg-gradient-to-r from-cosmic-500/10 to-aurora-500/10 border border-cosmic-500/20 rounded-xl p-4 hover:from-cosmic-500/15 hover:to-aurora-500/15 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-foreground mb-1">
                {actionText}
              </p>
              <p className="text-xs text-muted-foreground">
                🎯 Found 10+ opportunities on job boards. Check the link for current openings.
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap"
            >
              {buttonText}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Main content before Time to Act Now */}
        {beforeTimeToAct && (
          <div className="whitespace-pre-wrap leading-relaxed text-base">
            {renderTextWithLinks(beforeTimeToAct)}
          </div>
        )}

        {/* Time to Act Now section */}
        {timeToActContent && (
          <div className="mt-6 p-4 bg-gradient-to-r from-neon-500/10 to-aurora-500/10 border border-neon-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-neon-300 animate-pulse" />
              <span className="font-bold text-neon-300 text-lg">Time to Act Now</span>
            </div>
            <div className="space-y-3">
              {renderTimeToActAction(timeToActContent)}
            </div>
          </div>
        )}

        {/* Content after Time to Act Now */}
        {afterTimeToAct && (
          <div className="whitespace-pre-wrap leading-relaxed text-base">
            {renderTextWithLinks(afterTimeToAct)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-4 ${sender === 'user' ? 'flex-row-reverse' : ''} group`}>
      <Avatar className="w-12 h-12 border-2 border-cosmic-500/30">
        <AvatarFallback className={sender === 'user' ? 'bg-neon-500/20 text-neon-300' : 'bg-cosmic-500/20 text-cosmic-300'}>
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
      
      <div className={`max-w-[80%] ${sender === 'user' ? 'text-right' : ''}`}>
        <div
          className={`p-5 rounded-2xl leading-relaxed text-base ${
            sender === 'user'
              ? 'bg-gradient-to-br from-neon-500/15 to-neon-600/10 border border-neon-500/30'
              : isNudge
              ? 'bg-gradient-to-br from-aurora-500/15 to-aurora-600/10 border border-aurora-500/30'
              : 'bg-gradient-to-br from-cosmic-500/15 to-cosmic-600/10 border border-cosmic-500/30'
          } backdrop-blur-sm shadow-lg relative`}
        >
          {renderContent(content)}
          
          {/* Copy button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
            onClick={copyToClipboard}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground/60 mt-2 px-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
