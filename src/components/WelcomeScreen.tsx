'use client';

import { useState } from 'react';
import { generateUserId, getCurrentTimestamp } from '@/types';
import { saveUser, getUserByName, setCurrentUser } from '@/utils/storage';

interface WelcomeScreenProps {
  onUserLogin: (userId: string) => void;
}

export function WelcomeScreen({ onUserLogin }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          <img 
            src="/icon.png" 
            alt="Routine Tracker" 
            className="w-16 h-16 mx-auto mt-4 rounded-lg shadow-md"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            What we&apos;re building here 💻✅
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Type in your name</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Tick what you&apos;ve done for the day (Prayer, Study, Hygiene, Work, etc.)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>Submit, and it saves your progress</span>
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
            Ready to start tracking? 🚀
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting started...</span>
                </div>
              ) : (
                "Start Tracking 🔥"
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
