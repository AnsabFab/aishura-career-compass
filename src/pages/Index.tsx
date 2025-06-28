import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to create user data object
  const createUserData = (supabaseUser: User, storedGoal?: string | null) => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
      trustScore: 25,
      level: 1,
      xp: 0,
      tokens: 100,
      joinDate: new Date().toISOString(),
      avatar: 'career-starter',
      careerGoal: storedGoal || ''
    };
  };

  // Helper function to handle user authentication
  const handleUserAuthentication = (supabaseUser: User | null) => {
    if (supabaseUser) {
      console.log('User authenticated:', supabaseUser);
      
      // Check for stored career goal
      const storedGoal = localStorage.getItem('career_goal');
      
      const userData = createUserData(supabaseUser, storedGoal);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage as backup
      localStorage.setItem('aishura_user', JSON.stringify(userData));
      
      // Clear stored goal
      if (storedGoal) {
        localStorage.removeItem('career_goal');
      }
    } else {
      console.log('User not authenticated');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('aishura_user');
    }
  };

  // Check authentication state
  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!isMounted) return;
        
        setSession(session);
        handleUserAuthentication(session?.user || null);
        setLoading(false);
      }
    );

    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Try to load from localStorage as fallback
          const storedUser = localStorage.getItem('aishura_user');
          if (storedUser && isMounted) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (e) {
              console.error('Error parsing stored user data:', e);
              localStorage.removeItem('aishura_user');
            }
          }
        } else if (isMounted) {
          setSession(session);
          handleUserAuthentication(session?.user || null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem('aishura_user');
        if (storedUser && isMounted) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Error parsing stored user data:', e);
            localStorage.removeItem('aishura_user');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: any) => {
    console.log('Handling login with user data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Store in localStorage as backup
    localStorage.setItem('aishura_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
      }
      
      // Always clear local state regardless of Supabase result
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      localStorage.removeItem('aishura_user');
      localStorage.removeItem('career_goal');
      
      console.log('Logout completed');
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      // Force clear local state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      localStorage.removeItem('aishura_user');
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
        <div className="text-white text-xl font-orbitron">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
            Loading AIShura...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Navigation */}
      <Navbar 
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        user={user}
      />

      {/* Floating Orbs Background - only show when not authenticated */}
      {!isAuthenticated && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="floating-orb w-64 h-64 top-20 left-10 opacity-30" style={{ animationDelay: '0s' }} />
          <div className="floating-orb w-48 h-48 top-1/2 right-20 opacity-20" style={{ animationDelay: '2s' }} />
          <div className="floating-orb w-32 h-32 bottom-20 left-1/3 opacity-25" style={{ animationDelay: '4s' }} />
        </div>
      )}

      <main className="flex-1 relative z-10 w-full">
        {!isAuthenticated ? (
          <Hero onAuthClick={handleAuthClick} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </main>

      {/* Only show footer when not authenticated */}
      {!isAuthenticated && <Footer />}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
