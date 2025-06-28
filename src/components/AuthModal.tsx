
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Star } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check for stored career goal
    const storedGoal = localStorage.getItem('career_goal');

    // Mock user data for demo
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: isSignUp ? formData.name : formData.email.split('@')[0],
      trustScore: 25,
      level: 1,
      xp: 0,
      tokens: 100,
      joinDate: new Date().toISOString(),
      avatar: 'career-starter',
      careerGoal: storedGoal || ''
    };

    onLogin(userData);
    
    // Clear the stored goal
    if (storedGoal) {
      localStorage.removeItem('career_goal');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-cosmic-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-cosmic-400" />
              </div>
              <span className="font-orbitron text-2xl text-gradient">AIShura</span>
            </div>
            {isSignUp ? 'Join Your Career Journey' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {isSignUp ? 'Create your account to start your AI-powered career transformation' : 'Sign in to continue your career journey with AIShura'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
                placeholder="Confirm your password"
                required={isSignUp}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-cosmic-600 hover:bg-cosmic-700 text-white py-3 rounded-xl animate-pulse-glow"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-cosmic-400 hover:text-cosmic-300 text-sm transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>

        {isSignUp && (
          <div className="text-center text-xs text-muted-foreground mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
