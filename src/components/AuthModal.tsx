import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Star, Eye, EyeOff } from 'lucide-react';
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

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email address is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Full name is required for sign up",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting sign up with:', { email: formData.email, name: formData.name });
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name.trim()
            }
          }
        });

        console.log('Sign up response:', { data, error });

        if (error) {
          console.error('Sign up error:', error);
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.user) {
          // Check for stored career goal
          const storedGoal = localStorage.getItem('career_goal');
          
          // Create user data object
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
            careerGoal: storedGoal || ''
          };

          console.log('Created user data:', userData);

          // Clear the stored goal
          if (storedGoal) {
            localStorage.removeItem('career_goal');
          }

          // Call onLogin callback
          onLogin(userData);
          
          // Close modal
          onClose();

          toast({
            title: "Success",
            description: data.user.email_confirmed_at 
              ? "Account created successfully!" 
              : "Account created! Please check your email to verify your account.",
          });
        }
      } else {
        console.log('Attempting sign in with:', { email: formData.email });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password
        });

        console.log('Sign in response:', { data, error });

        if (error) {
          console.error('Sign in error:', error);
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        if (data.user) {
          // Check for stored career goal
          const storedGoal = localStorage.getItem('career_goal');
          
          // Create user data object
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
            careerGoal: storedGoal || ''
          };

          console.log('Created user data:', userData);

          // Clear the stored goal
          if (storedGoal) {
            localStorage.removeItem('career_goal');
          }

          // Call onLogin callback
          onLogin(userData);
          
          // Close modal
          onClose();

          toast({
            title: "Success",
            description: "Signed in successfully!",
          });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form when switching modes
    setFormData({
      email: formData.email, // Keep email
      password: '',
      name: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
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
                placeholder="Enter your password"
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
            className="w-full bg-cosmic-600 hover:bg-cosmic-700 text-white py-3 rounded-xl animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-cosmic-400 hover:text-cosmic-300 text-sm transition-colors"
              disabled={loading}
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
