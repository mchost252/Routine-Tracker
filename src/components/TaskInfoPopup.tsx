'use client';

import { useState, useEffect, useRef } from 'react';
import { RoutineItem } from '@/types';

interface TaskInfoPopupProps {
  item: RoutineItem;
  onClose: () => void;
}

export function TaskInfoPopup({ item, onClose }: TaskInfoPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
    
    // Close when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match transition duration
  };

  if (!item.detailedInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div 
        ref={popupRef}
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{item.icon}</div>
            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Purpose */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Purpose</h4>
            <p className="text-gray-600">{item.detailedInfo.purpose}</p>
          </div>
          
          {/* Benefits */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.detailedInfo.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600">{benefit}</li>
              ))}
            </ul>
          </div>
          
          {/* Tips */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.detailedInfo.tips.map((tip, index) => (
                <li key={index} className="text-gray-600">{tip}</li>
              ))}
            </ul>
          </div>
          
          {/* Time & Frequency */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              {item.detailedInfo.timeRecommendation && (
                <div>
                  <h4 className="text-sm font-semibold text-indigo-800 mb-1">Recommended Time</h4>
                  <p className="text-indigo-700">{item.detailedInfo.timeRecommendation}</p>
                </div>
              )}
              {item.detailedInfo.frequency && (
                <div>
                  <h4 className="text-sm font-semibold text-indigo-800 mb-1">Frequency</h4>
                  <p className="text-indigo-700">{item.detailedInfo.frequency}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
