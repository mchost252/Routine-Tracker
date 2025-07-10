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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Check if user is authorized
    if (!isUserAuthorized(name.trim())) {
      return; // Don't proceed if not authorized
    }

    setIsLoading(true);

    try {
      // Show success message first
      setShowSuccess(true);

      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      let user = getUserByName(name.trim());

      if (!user) {
        // Create new user with display name
        user = {
          id: generateUserId(name.trim()),
          name: getUserDisplayName(name.trim()),
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
      setShowSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img
              src="/icon.png"
              alt="Routine Tracker"
              className="w-16 h-16 mx-auto rounded-lg shadow-lg"
            />
          </div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
                  name.trim() && !isUserAuthorized(name.trim())
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                disabled={isLoading || showSuccess}
                required
              />
              {name.trim() && !isUserAuthorized(name.trim()) && (
                <p className="mt-2 text-sm text-red-600">
                  ❌ Sorry, you're not authorized to access this tracker. Contact the admin to get access.
                </p>
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting started...</span>
                </div>
              ) : (
                'Start Tracking 🔥'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>No login stress. No judgment. Just you, your goals, and your growth.</p>
          <p className="mt-2 text-xs">
            Built with ❤️ by <span className="font-semibold text-indigo-600">Tech Talk</span>
          </p>
        </div>
      </div>
    </div>
  );
}
