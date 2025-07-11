'use client';

import { useState, useEffect } from 'react';

interface PinInputScreenProps {
  userName: string;
  onPinSubmit: (pin: string) => void;
  onBack: () => void;
  error?: string;
}

export function PinInputScreen({ userName, onPinSubmit, onBack, error }: PinInputScreenProps) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-submit when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);

  const handleSubmit = async () => {
    if (pin.length !== 4) return;
    
    setIsLoading(true);
    try {
      onPinSubmit(pin);
    } catch (error) {
      console.error('PIN submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypadClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/icon.png" 
            alt="Routine Tracker" 
            className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-md"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600">
            Enter your 4-digit PIN to continue
          </p>
        </div>

        {/* PIN Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-center space-x-4 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                  pin.length > index
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {pin.length > index ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeypadClick(digit.toString())}
                disabled={pin.length >= 4 || isLoading}
                className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Bottom row: Clear, 0, Backspace */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleClear}
              disabled={pin.length === 0 || isLoading}
              className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => handleKeypadClick('0')}
              disabled={pin.length >= 4 || isLoading}
              className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={pin.length === 0 || isLoading}
              className="h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ⌫
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-indigo-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="text-sm">Verifying...</span>
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="text-center">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back to name entry
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Built with ❤️ by Tech Talk
          </p>
        </div>
      </div>
    </div>
  );
}
