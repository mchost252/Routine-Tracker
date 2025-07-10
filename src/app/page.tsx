'use client';

import { useState, useEffect } from 'react';
import { RoutineTracker } from '@/components/RoutineTracker';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { getCurrentUser } from '@/utils/storage';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userId = getCurrentUser();
    setCurrentUserId(userId);
    setIsLoading(false);
  }, []);

  const handleUserLogin = (userId: string) => {
    setCurrentUserId(userId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="loading-spinner h-16 w-16 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">🧱</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 animate-fade-in">
            Setting up your tracker...
          </h2>
          <p className="text-gray-600 animate-fade-in-delay">
            Get ready to track your daily growth! ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 transition-all duration-500">
      <div className="animate-fade-in">
        {currentUserId ? (
          <RoutineTracker userId={currentUserId} onLogout={() => setCurrentUserId(null)} />
        ) : (
          <WelcomeScreen onUserLogin={handleUserLogin} />
        )}
      </div>
    </div>
  );
}
