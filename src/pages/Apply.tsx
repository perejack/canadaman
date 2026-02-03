import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import InteractiveApplicationForm from '@/components/InteractiveApplicationForm';
import Footer from '@/components/Footer';
import AuthSystem from '@/components/auth/AuthSystem';

function isUuid(value: any) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

const Apply = () => {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('job') || '';
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('canadaJobsUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (isUuid(parsed?.id)) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem('canadaJobsUser');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) return;
    try {
      const existing = localStorage.getItem('canadaJobsApplicationData');
      if (!existing) {
        localStorage.setItem('canadaJobsApplicationData', JSON.stringify({ jobTitle, redirectToSignup: true }));
      }
    } catch {
      // ignore
    }
  }, [jobTitle, user]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('canadaJobsUser', JSON.stringify(userData));
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        {isLoading ? null : user ? (
          <InteractiveApplicationForm jobTitle={jobTitle} />
        ) : (
          <AuthSystem onLogin={handleLogin} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Apply;