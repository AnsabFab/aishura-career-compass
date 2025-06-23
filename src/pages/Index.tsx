
import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in (localStorage for demo)
  useEffect(() => {
    const savedUser = localStorage.getItem('aishura_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('aishura_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('aishura_user');
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Navigation */}
      <Navbar 
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb w-64 h-64 top-20 left-10 opacity-30" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-48 h-48 top-1/2 right-20 opacity-20" style={{ animationDelay: '2s' }} />
        <div className="floating-orb w-32 h-32 bottom-20 left-1/3 opacity-25" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 relative z-10 w-full">
        {!isAuthenticated ? (
          <Hero onAuthClick={handleAuthClick} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
