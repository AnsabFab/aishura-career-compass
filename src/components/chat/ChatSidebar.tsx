
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, Edit2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
}

export const ChatSidebar = ({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession
}: ChatSidebarProps) => {
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const saveRename = () => {
    if (editingSession && editTitle.trim()) {
      onRenameSession(editingSession, editTitle.trim());
    }
    setEditingSession(null);
    setEditTitle('');
  };

  return (
    <div className="w-80 h-full glass-effect border-r border-cosmic-500/20 bg-gradient-to-b from-cosmic-900/10 to-aurora-900/10">
      {/* Header */}
      <div className="p-6 border-b border-cosmic-500/20">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
            alt="AIShura Logo" 
            className="w-8 h-8 object-contain"
          />
          <h2 className="font-orbitron text-xl font-bold text-gradient bg-gradient-to-r from-cosmic-400 to-aurora-400 bg-clip-text">
            AIShura
          </h2>
        </div>
        <Button
          onClick={onNewSession}
          className="w-full bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                session.id === activeSessionId
                  ? 'bg-gradient-to-r from-cosmic-500/20 to-aurora-500/20 border border-cosmic-500/30'
                  : 'hover:bg-cosmic-500/10 border border-transparent'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-cosmic-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingSession === session.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={saveRename}
                      onKeyPress={(e) => e.key === 'Enter' && saveRename()}
                      className="w-full bg-transparent border-b border-cosmic-500/50 text-sm font-medium text-foreground focus:outline-none focus:border-aurora-500"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {session.title}
                    </h3>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {session.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {session.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0 hover:bg-cosmic-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename(session.id, session.title);
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0 hover:bg-red-500/20 text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
