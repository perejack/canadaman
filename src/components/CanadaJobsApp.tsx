import React, { useState, useEffect } from 'react';
import AuthSystem from './auth/AuthSystem';
import Dashboard from './dashboard/Dashboard';
import MessagingInbox from './dashboard/MessagingInbox';
import { supabase } from '@/integrations/supabase/client';

const CanadaJobsApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'messages'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const sessionUser = sessionData.session?.user;
        if (!sessionUser) {
          if (isMounted) setUser(null);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        if (isMounted) {
          setUser({
            id: sessionUser.id,
            username: profile?.username ?? sessionUser.email?.split('@')[0] ?? 'user',
            email: sessionUser.email,
            fullName: profile?.full_name ?? '',
            phone: profile?.phone ?? '',
            location: profile?.location ?? '',
            dateOfBirth: profile?.date_of_birth ?? '',
            positionApplied: profile?.position_applied ?? '',
            accountStatus: profile?.account_status ?? 'basic',
          });
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
        if (isMounted) setUser(null);
      }
    };

    loadUser().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      setUser({
        id: session.user.id,
        username: profile?.username ?? session.user.email?.split('@')[0] ?? 'user',
        email: session.user.email,
        fullName: profile?.full_name ?? '',
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        dateOfBirth: profile?.date_of_birth ?? '',
        positionApplied: profile?.position_applied ?? '',
        accountStatus: profile?.account_status ?? 'basic',
      });
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    supabase.auth.signOut().finally(() => {
      setUser(null);
      setCurrentView('dashboard');
    });
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
