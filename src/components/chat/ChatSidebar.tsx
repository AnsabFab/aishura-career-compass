import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, Edit2, Sparkles } from 'lucide-react';

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
    <div className="w-80 h-full ai-sidebar relative z-10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl ai-glass-effect flex items-center justify-center border border-purple-400/30">
            <img 
              src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
              alt="AIShura Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h2 className="font-orbitron text-xl font-bold ai-glow-text">
              AIShura
            </h2>
            <p className="text-xs text-gray-400">Career Intelligence</p>
          </div>
        </div>
        <Button
          onClick={onNewSession}
          className="w-full ai-button-glow text-white font-medium h-12 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ai-card-hover ${
                session.id === activeSessionId
                  ? 'ai-glass-effect border border-purple-400/40 bg-gradient-to-r from-purple-500/10 to-blue-500/10'
                  : 'hover:ai-glass-effect hover:border hover:border-white/20'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg ai-glass-effect flex items-center justify-center border border-purple-400/20 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  {editingSession === session.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={saveRename}
                      onKeyPress={(e) => e.key === 'Enter' && saveRename()}
                      className="w-full bg-transparent border-b border-purple-400/50 text-sm font-medium text-white focus:outline-none focus:border-purple-300"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-white truncate mb-1">
                      {session.title}
                    </h3>
                  )}
                  <p className="text-xs text-gray-400 truncate leading-relaxed">
                    {session.lastMessage}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {session.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-7 h-7 p-0 hover:bg-purple-500/20 text-purple-300"
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
                  className="w-7 h-7 p-0 hover:bg-red-500/20 text-red-400"
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

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3" />
          <span>Powered by Advanced AI</span>
        </div>
      </div>
    </div>
  );
};
