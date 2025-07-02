
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Star, Eye, EyeOff } from 'lucide-react';
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
          console.error('Sign up error:', error);
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

          localStorage.removeItem('career_goal');
          
          onLogin(userData);
          onClose();

          toast({
            title: "🎉 Welcome to AIShura!",
            description: "Your cosmic career journey begins now!",
          });
        }

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });

        if (error) {
          console.error('Sign in error:', error);
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

          localStorage.removeItem('career_goal');
          
          onLogin(userData);
          onClose();

          toast({
            title: "🚀 Welcome back to the cosmos!",
            description: "Ready to continue your stellar career journey?",
          });
        }
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "A cosmic disturbance occurred. Please try again.",
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
      email: prev.email,
      password: '',
      name: '',
      confirmPassword: ''
    }));
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-xl border-2 border-purple-500/30 max-w-md w-full mx-4 shadow-2xl rounded-2xl z-[100]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-2xl"></div>
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="font-orbitron text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  AIShura
                </span>
              </div>
              <span className="text-white text-xl font-medium">
                {isSignUp ? '🌟 Join the Cosmic Career Revolution' : '✨ Welcome Back, Cosmic Traveler'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300 text-base">
              {isSignUp ? 'Create your account to unlock AI-powered career insights from across the universe' : 'Sign in to continue your stellar journey to career excellence'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {isSignUp && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-white mb-2 block">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-black/30 backdrop-blur-xl border-2 border-purple-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-gray-400 rounded-xl h-12"
                  placeholder="Enter your cosmic name"
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-white mb-2 block">
                Email Address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-black/30 backdrop-blur-xl border-2 border-purple-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-gray-400 rounded-xl h-12"
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-white mb-2 block">
                Password <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-black/30 backdrop-blur-xl border-2 border-purple-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-gray-400 rounded-xl h-12 pr-12"
                  placeholder="Enter your cosmic password (min 6 characters)"
                  disabled={loading}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-white mb-2 block">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-black/30 backdrop-blur-xl border-2 border-purple-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-gray-400 rounded-xl h-12 pr-12"
                    placeholder="Confirm your cosmic password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl transition-all duration-300 text-lg font-semibold shadow-2xl hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignUp ? 'Creating Your Cosmic Identity...' : 'Accessing the Cosmos...'}
                </div>
              ) : (
                isSignUp ? '🚀 Launch My Journey' : '✨ Enter the Cosmos'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-purple-300 hover:text-purple-200 text-sm transition-colors disabled:opacity-50 hover:underline"
                disabled={loading}
              >
                {isSignUp 
                  ? 'Already exploring the cosmos? Sign in here →'
                  : "Ready for your cosmic adventure? Create your account →"
                }
              </button>
            </div>
          </form>

          {isSignUp && (
            <div className="text-center text-xs text-gray-400 mt-4 opacity-80">
              By joining AIShura, you're agreeing to transform your career with cosmic AI intelligence
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
