
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onAuthClick: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar = ({ onAuthClick, isAuthenticated, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-cosmic-500/20 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Only */}
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/a181e3a8-6975-4e35-9a9a-3a612cb5a3b9.png" 
                alt="AIShura Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Features
            </a>
            <a href="#quests" className="text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Quests
            </a>
            <a href="#leaderboard" className="text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Leaderboard
            </a>
            <a href="#about" className="text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={onAuthClick}
                  className="border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white shadow-lg"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10"
              >
                Sign Out
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-cosmic-500/20">
            <a href="#features" className="block text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Features
            </a>
            <a href="#quests" className="block text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Quests
            </a>
            <a href="#leaderboard" className="block text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              Leaderboard
            </a>
            <a href="#about" className="block text-foreground/80 hover:text-cosmic-400 transition-colors font-medium">
              About
            </a>
            <div className="pt-4 space-y-3">
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={onAuthClick}
                    className="w-full border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={onAuthClick}
                    className="w-full bg-gradient-to-r from-cosmic-600 to-aurora-600 hover:from-cosmic-700 hover:to-aurora-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="w-full border-cosmic-500/50 text-cosmic-400 hover:bg-cosmic-500/10"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
