import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Refs to prevent unnecessary re-renders and modal popups
  const authStateInitialized = useRef(false);
  const preventModalPopup = useRef(false);

  // Add debug info
  const addDebugInfo = useCallback((info: string) => {
    console.log('[INDEX DEBUG]:', info);
    setDebugInfo(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${info}`]);
  }, []);

  // Helper function to create user data object
  const createUserData = useCallback((supabaseUser: User, storedGoal?: string | null) => {
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
  }, []);

  // Helper function to handle user authentication
  const handleUserAuthentication = useCallback((supabaseUser: User | null, source: string = 'unknown') => {
    addDebugInfo(`handleUserAuthentication called from: ${source}`);
    
    if (supabaseUser) {
      addDebugInfo(`User authenticated: ${supabaseUser.email}`);
      
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
        addDebugInfo('Cleared stored career goal');
      }
    } else {
      addDebugInfo('User not authenticated - clearing state');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('aishura_user');
    }
  }, [createUserData, addDebugInfo]);

  // Initialize authentication
  useEffect(() => {
    let isMounted = true;
    addDebugInfo('Starting auth initialization');

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          addDebugInfo(`Session error: ${error.message}`);
          // Try localStorage fallback
          const storedUser = localStorage.getItem('aishura_user');
          if (storedUser && isMounted) {
            try {
              const userData = JSON.parse(storedUser);
              addDebugInfo('Using localStorage fallback');
              setUser(userData);
              setIsAuthenticated(true);
            } catch (e) {
              addDebugInfo('Invalid localStorage data - clearing');
              localStorage.removeItem('aishura_user');
            }
          }
        } else {
          if (isMounted) {
            setSession(session);
            handleUserAuthentication(session?.user || null, 'initial-session');
          }
        }
      } catch (error: any) {
        addDebugInfo(`Auth initialization error: ${error.message}`);
      } finally {
        if (isMounted) {
          authStateInitialized.current = true;
          setLoading(false);
          addDebugInfo('Auth initialization completed');
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [handleUserAuthentication, addDebugInfo]);

  // Set up auth state listener (separate from initialization)
  useEffect(() => {
    addDebugInfo('Setting up auth state listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only process auth changes after initial setup
        if (!authStateInitialized.current) {
          addDebugInfo(`Ignoring auth event during initialization: ${event}`);
          return;
        }

        addDebugInfo(`Auth state changed: ${event} - User: ${session?.user?.email || 'none'}`);
        
        setSession(session);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            handleUserAuthentication(session?.user || null, 'auth-event-signin');
            break;
          case 'SIGNED_OUT':
            handleUserAuthentication(null, 'auth-event-signout');
            break;
          case 'TOKEN_REFRESHED':
            addDebugInfo('Token refreshed');
            break;
          default:
            addDebugInfo(`Unhandled auth event: ${event}`);
        }
      }
    );

    return () => {
      addDebugInfo('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [handleUserAuthentication, addDebugInfo]);

  // Prevent modal from showing during window resize/minimize
  useEffect(() => {
    const handleResize = () => {
      preventModalPopup.current = true;
      addDebugInfo(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        preventModalPopup.current = false;
      }, 1000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        preventModalPopup.current = true;
        addDebugInfo('Window hidden - preventing modal popup');
        
        setTimeout(() => {
          preventModalPopup.current = false;
        }, 2000);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [addDebugInfo]);

  const handleLogin = useCallback((userData: any) => {
    addDebugInfo('Manual login triggered');
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('aishura_user', JSON.stringify(userData));
  }, [addDebugInfo]);

  const handleLogout = useCallback(async () => {
    try {
      addDebugInfo('Logout initiated');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        addDebugInfo(`Logout error: ${error.message}`);
      }
      
      // Always clear local state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      localStorage.removeItem('aishura_user');
      localStorage.removeItem('career_goal');
      
      addDebugInfo('Logout completed');
    } catch (error: any) {
      addDebugInfo(`Unexpected logout error: ${error.message}`);
      // Force clear state
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      localStorage.removeItem('aishura_user');
    }
  }, [addDebugInfo]);

  const handleAuthClick = useCallback(() => {
    if (preventModalPopup.current) {
      addDebugInfo('Auth click prevented due to recent window event');
      return;
    }
    
    addDebugInfo('Auth modal requested');
    setShowAuthModal(true);
  }, [addDebugInfo]);

  const handleCloseAuthModal = useCallback(() => {
    addDebugInfo('Auth modal close requested');
    setShowAuthModal(false);
  }, [addDebugInfo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
        <div className="text-white text-xl font-orbitron">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-cosmic-400 border-t-transparent rounded-full animate-spin"></div>
              Loading AIShura...
            </div>
            {/* Debug info - remove in production */}
            {debugInfo.length > 0 && (
              <div className="text-xs text-gray-400 max-w-md">
                <div className="text-center mb-2">Debug Info:</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {debugInfo.slice(-5).map((info, index) => (
                    <div key={index}>{info}</div>
                  ))}
                </div>
              </div>
            )}
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

      {/* Debug Panel - Remove in production */}
      {debugInfo.length > 0 && !isAuthenticated && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="text-yellow-400 mb-2">Debug Info:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {debugInfo.slice(-10).map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
