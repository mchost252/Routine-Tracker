'use client';

import { useState } from 'react';

interface ChangePinPopupProps {
  onChangePin: (currentPin: string, newPin: string) => Promise<boolean> | boolean;
  onCancel: () => void;
  userName: string;
}

export function ChangePinPopup({ onChangePin, onCancel, userName }: ChangePinPopupProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentPin.length !== 4) {
      setError('Current PIN must be exactly 4 digits');
      return;
    }

    if (!/^\d{4}$/.test(currentPin)) {
      setError('Current PIN must contain only numbers');
      return;
    }

    if (newPin.length !== 4) {
      setError('New PIN must be exactly 4 digits');
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setError('New PIN must contain only numbers');
      return;
    }

    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }

    if (currentPin === newPin) {
      setError('New PIN must be different from current PIN');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onChangePin(currentPin, newPin);
      if (!result) {
        setError('Current PIN is incorrect. Please try again.');
      }
    } catch {
      setError('Failed to change PIN. Please try again.');
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
            Change Your PIN
          </h2>
          <p className="text-gray-600">
            Hi {userName}! Enter your current PIN and set a new 4-digit PIN.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* PIN Change Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPin" className="block text-sm font-medium text-gray-700 mb-2">
              Current PIN
            </label>
            <input
              type="password"
              id="currentPin"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.slice(0, 4))}
              placeholder="••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-center text-2xl tracking-widest"
              maxLength={4}
              pattern="[0-9]{4}"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 mb-2">
              New PIN
            </label>
            <input
              type="password"
              id="newPin"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.slice(0, 4))}
              placeholder="••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-center text-2xl tracking-widest"
              maxLength={4}
              pattern="[0-9]{4}"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmNewPin" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </label>
            <input
              type="password"
              id="confirmNewPin"
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

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !currentPin || !newPin || !confirmPin}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Changing...</span>
                </div>
              ) : (
                'Change PIN 🔒'
              )}
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-xs">
            🔒 Your PIN is securely stored and protects your routine data from unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}
