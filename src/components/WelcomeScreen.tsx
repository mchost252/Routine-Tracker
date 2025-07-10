'use client';

import { useState } from 'react';
import { User, generateUserId, getCurrentTimestamp } from '@/types';
import { saveUser, getUserByName, setCurrentUser } from '@/utils/storage';
import { isUserAuthorized, getUserDisplayName } from '@/config/auth';

interface WelcomeScreenProps {
  onUserLogin: (userId: string) => void;
}

export function WelcomeScreen({ onUserLogin }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    try {
      // Check if user already exists
      let user = getUserByName(name.trim());
      
      if (!user) {
        // Create new user
        user = {
          id: generateUserId(name.trim()),
          name: name.trim(),
          createdAt: getCurrentTimestamp(),
          lastActive: getCurrentTimestamp()
        };
        saveUser(user);
      } else {
        // Update last active time
        user.lastActive = getCurrentTimestamp();
        saveUser(user);
      }

      // Set as current user
      setCurrentUser(user.id);
      onUserLogin(user.id);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧱</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Digital Routine & Results Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track your daily growth with intention
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            What we're building here 💻✅
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Type in your name</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Tick what you've done for the day (Prayer, Study, Hygiene, Work, etc.)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Submit, and it saves your progress</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Come back anytime before the day ends to update it</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>System resets at midnight, but keeps a history of your growth</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ready to track your growth? 📊✨
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                disabled={isLoading}
                required
              />
              {name.trim() && !authError && isUserAuthorized(name.trim()) && (
                <p className="mt-2 text-sm text-indigo-600 animate-fade-in">
                  Hi {getUserDisplayName(name)}! Nice to meet you! 👋
                </p>
              )}
              {name.trim() && !isUserAuthorized(name.trim()) && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">🚫</span>
                    <p className="text-sm text-red-700 font-medium">Access denied</p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Your name is not on the authorized list. Contact the administrator for access.
                  </p>
                </div>
              )}
              {authError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">⚠️</span>
                    <p className="text-sm text-red-700 font-medium">{authError}</p>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !name.trim() || showSuccess || (!!name.trim() && !isUserAuthorized(name.trim()))}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {showSuccess ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">✅</span>
                  <span>Welcome aboard, {getUserDisplayName(name)}!</span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Setting up your tracker...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Start My Journey</span>
                  <span className="text-xl">🚀</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>No login stress. No judgment. Just you, your goals, and your growth.</p>
        </div>
      </div>
    </div>
  );
}
