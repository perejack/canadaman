import React, { useState, useEffect } from 'react';
import AuthSystem from './auth/AuthSystem';
import Dashboard from './dashboard/Dashboard';
import MessagingInbox from './dashboard/MessagingInbox';

const CanadaJobsApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'messages'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('canadaJobsUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('canadaJobsUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('canadaJobsUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('canadaJobsUser');
  };

  const handleViewMessages = () => {
    setCurrentView('messages');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-canadian-red-light via-white to-canadian-blue-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-canadian-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-foreground">Loading Canada Jobs Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthSystem onLogin={handleLogin} />;
  }

  if (currentView === 'messages') {
    return <MessagingInbox onBack={handleBackToDashboard} user={user} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default CanadaJobsApp;
