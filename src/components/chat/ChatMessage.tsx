
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Copy, ExternalLink } from 'lucide-react';

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
    // Enhanced link rendering with proper styling
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const parts = text.split(linkRegex);
    
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
      
      // Regular text - check for "Time to Act Now" formatting
      if (part.includes('**⚡ Time to Act Now:**')) {
        return (
          <div key={index} className="mt-4">
            {part.split('**⚡ Time to Act Now:**').map((segment, segIndex) => {
              if (segIndex === 0) return segment;
              return (
                <div key={segIndex} className="mt-3 p-4 bg-gradient-to-r from-neon-500/10 to-aurora-500/10 border border-neon-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">⚡</span>
                    <span className="font-bold text-neon-300">Time to Act Now:</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {segment}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex items-start gap-4 ${sender === 'user' ? 'flex-row-reverse' : ''} group`}>
      <Avatar className="w-10 h-10 border-2 border-cosmic-500/30">
        <AvatarFallback className={sender === 'user' ? 'bg-neon-500/20 text-neon-300' : 'bg-cosmic-500/20 text-cosmic-300'}>
          {sender === 'user' ? (
            <User className="w-5 h-5" />
          ) : (
            <img 
              src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
              alt="AIShura" 
              className="w-5 h-5 object-contain"
            />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={`max-w-[80%] ${sender === 'user' ? 'text-right' : ''}`}>
        <div
          className={`p-4 rounded-2xl leading-relaxed ${
            sender === 'user'
              ? 'bg-gradient-to-br from-neon-500/15 to-neon-600/10 border border-neon-500/30'
              : isNudge
              ? 'bg-gradient-to-br from-aurora-500/15 to-aurora-600/10 border border-aurora-500/30'
              : 'bg-gradient-to-br from-cosmic-500/15 to-cosmic-600/10 border border-cosmic-500/30'
          } backdrop-blur-sm shadow-lg relative`}
        >
          <div className="whitespace-pre-wrap">
            {renderContent(content)}
          </div>
          
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
