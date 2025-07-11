'use client';

import { useState } from 'react';

interface PinSetupPopupProps {
  onSetPin: (pin: string) => void;
  onSkip: () => void;
  userName: string;
}

export function PinSetupPopup({ onSetPin, onSkip, userName }: PinSetupPopupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must contain only numbers');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setIsLoading(true);
    try {
      onSetPin(pin);
    } catch (err) {
      setError('Failed to set PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Secure Your Account
          </h2>
          <p className="text-gray-600">
            Hi {userName}! Set up a 4-digit PIN to protect your progress from unauthorized access.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Why set a PIN?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Prevent others from accessing your account</li>
            <li>• Keep your progress private and secure</li>
            <li>• Quick and easy to enter (just 4 digits)</li>
          </ul>
        </div>

        {/* PIN Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              Enter 4-digit PIN
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 4))}
              placeholder="••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-center text-2xl tracking-widest"
              maxLength={4}
              pattern="[0-9]{4}"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm PIN
            </label>
            <input
              type="password"
              id="confirmPin"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))}
              placeholder="••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-center text-2xl tracking-widest"
              maxLength={4}
              pattern="[0-9]{4}"
              disabled={isLoading}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin || !confirmPin}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Setting up...</span>
                </div>
              ) : (
                'Set PIN 🔒'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You can change or remove your PIN anytime from the menu
        </p>
      </div>
    </div>
  );
}
