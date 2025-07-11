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
          <img
            src="/icon.png"
            alt="Routine Tracker"
            className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-md"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading your routine tracker...</p>
          <p className="text-sm text-indigo-600 font-semibold">
            Built with ❤️ by Tech Talk
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentUserId ? (
        <RoutineTracker userId={currentUserId} onLogout={() => setCurrentUserId(null)} />
      ) : (
        <WelcomeScreen onUserLogin={handleUserLogin} />
      )}
    </div>
  );
}
