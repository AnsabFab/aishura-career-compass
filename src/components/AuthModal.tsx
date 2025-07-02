
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Star, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Invalid email format");
    }

    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        errors.push("Name is required for signup");
      }
      if (formData.password !== formData.confirmPassword) {
        errors.push("Passwords don't match");
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name.trim()
            }
          }
        });

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.user) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: formData.name.trim() || data.user.email?.split('@')[0],
            trustScore: 25,
            level: 1,
            xp: 0,
            tokens: 100,
            joinDate: new Date().toISOString(),
            avatar: 'career-starter',
            careerGoal: localStorage.getItem('career_goal') || ''
          };

          // Clear stored career goal
          localStorage.removeItem('career_goal');
          
          onLogin(userData);
          onClose();

          toast({
            title: "Welcome to AIShura! ✨",
            description: data.user.email_confirmed_at 
              ? "Your career transformation journey begins now!" 
              : "Please check your email to verify your account and unlock your full potential.",
          });
        }

      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });

        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.user && data.session) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
            trustScore: 25,
            level: 1,
            xp: 0,
            tokens: 100,
            joinDate: new Date().toISOString(),
            avatar: 'career-starter',
            careerGoal: localStorage.getItem('career_goal') || ''
          };

          // Clear stored career goal
          localStorage.removeItem('career_goal');
          
          onLogin(userData);
          onClose();

          toast({
            title: "Welcome back! 🚀",
            description: "Ready to continue your amazing career journey?",
          });
        }
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData(prev => ({
      email: prev.email, // Keep email
      password: '',
      name: '',
      confirmPassword: ''
    }));
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="glass-effect border-cosmic-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-cosmic-400" />
              </div>
              <span className="font-orbitron text-2xl text-gradient">AIShura</span>
            </div>
            {isSignUp ? 'Begin Your Career Transformation' : 'Welcome Back, Future Leader'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {isSignUp ? 'Create your account to unlock AI-powered career insights' : 'Sign in to continue your journey to career excellence'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
                placeholder="Enter your full name"
                disabled={loading}
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="glass-effect border-cosmic-500/30 focus:border-cosmic-500"
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="glass-effect border-cosmic-500/30 focus:border-cosmic-500 pr-10"
                placeholder="Enter your password (min 6 characters)"
                disabled={loading}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="glass-effect border-cosmic-500/30 focus:border-cosmic-500 pr-10"
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cosmic-600 hover:bg-cosmic-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isSignUp ? 'Creating Your Future...' : 'Welcoming You Back...'}
              </div>
            ) : (
              isSignUp ? '🚀 Start My Journey' : '✨ Welcome Me Back'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-cosmic-400 hover:text-cosmic-300 text-sm transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {isSignUp 
                ? 'Already transforming careers? Sign in here'
                : "Ready for your breakthrough? Create your account"
              }
            </button>
          </div>
        </form>

        {isSignUp && (
          <div className="text-center text-xs text-muted-foreground mt-4">
            By joining AIShura, you're agreeing to transform your career with AI-powered intelligence
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
