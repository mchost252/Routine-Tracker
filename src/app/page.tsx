'use client';

import { useState, useEffect } from 'react';
import { RoutineTracker } from '@/components/RoutineTracker';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PinInputScreen } from '@/components/PinInputScreen';
import { getCurrentUser, userHasPin, verifyPin, getUsers } from '@/utils/storage';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const userId = getCurrentUser();
    setCurrentUserId(userId);
    setIsLoading(false);
  }, []);

  const handleUserLogin = (userId: string) => {
    // Check if user has PIN setup
    if (userHasPin(userId)) {
      // Show PIN input screen
      setPendingUserId(userId);
      setShowPinInput(true);
      setPinError('');
    } else {
      // Direct login (no PIN required)
      setCurrentUserId(userId);
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (!pendingUserId) return;

    if (verifyPin(pendingUserId, pin)) {
      // PIN correct, log in user
      setCurrentUserId(pendingUserId);
      setShowPinInput(false);
      setPendingUserId(null);
      setPinError('');
    } else {
      // PIN incorrect
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  const handlePinBack = () => {
    setShowPinInput(false);
    setPendingUserId(null);
    setPinError('');
  };

  const getPendingUserName = (): string => {
    if (!pendingUserId) return '';
    const users = getUsers();
    const user = users.find(u => u.id === pendingUserId);
    return user?.name || '';
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

  // Show PIN input screen if needed
  if (showPinInput && pendingUserId) {
    return (
      <PinInputScreen
        userName={getPendingUserName()}
        onPinSubmit={handlePinSubmit}
        onBack={handlePinBack}
        error={pinError}
      />
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
