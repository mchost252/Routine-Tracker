'use client';

import { useState, useEffect } from 'react';
import {
  DailyProgress,
  getCurrentDate,
  getCurrentTimestamp,
  calculateCompletionRate,
  getTodayRoutineItems,
  getNigerianTimeDisplay,
  RoutineItem
} from '@/types';
import {
  getTodayProgress,
  saveDailyProgress,
  checkAndPerformDailyReset,
  setCurrentUser,
  userHasPin,
  setPinForUser
} from '@/utils/storage';
import { WeeklyReport } from './WeeklyReport';
import { TaskInfoPopup } from './TaskInfoPopup';
import { PinSetupPopup } from './PinSetupPopup';

interface RoutineTrackerProps {
  userId: string;
  onLogout: () => void;
}

export function RoutineTracker({ userId, onLogout }: RoutineTrackerProps) {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [todayRoutineItems, setTodayRoutineItems] = useState(getTodayRoutineItems());
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [showPinSetup, setShowPinSetup] = useState(false);

  useEffect(() => {
    initializeTracker();
  }, [userId]);

  // Update routine items when day changes
  useEffect(() => {
    const updateRoutineItems = () => {
      setTodayRoutineItems(getTodayRoutineItems());
    };

    // Update immediately
    updateRoutineItems();

    // Set up interval to check for day change every minute
    const interval = setInterval(() => {
      updateRoutineItems();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const initializeTracker = async () => {
    setIsLoading(true);
    
    try {
      // Check for daily reset
      checkAndPerformDailyReset(userId);
      
      // Get user info
      const users = JSON.parse(localStorage.getItem('routine_tracker_users') || '[]');
      const currentUser = users.find((u: { id: string; name: string }) => u.id === userId);
      setUser(currentUser);
      
      // Get today's progress
      const todayProgress = getTodayProgress(userId);
      
      if (todayProgress) {
        setProgress(todayProgress);
      } else {
        // Create new progress for today
        const newProgress: DailyProgress = {
          userId,
          date: getCurrentDate(),
          completedItems: [],
          lastUpdated: getCurrentTimestamp()
        };
        setProgress(newProgress);
        saveDailyProgress(newProgress);
      }

      // Check if user needs PIN setup (only show once)
      if (!userHasPin(userId)) {
        // Show PIN setup popup after a short delay
        setTimeout(() => {
          setShowPinSetup(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error initializing tracker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = async (itemId: string) => {
    if (!progress || isSaving) return;

    setIsSaving(true);
    
    try {
      const updatedItems = progress.completedItems.includes(itemId)
        ? progress.completedItems.filter(id => id !== itemId)
        : [...progress.completedItems, itemId];

      const updatedProgress: DailyProgress = {
        ...progress,
        completedItems: updatedItems,
        lastUpdated: getCurrentTimestamp()
      };

      setProgress(updatedProgress);
      saveDailyProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser('');
    onLogout();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const openWeeklyReport = () => {
    setShowWeeklyReport(true);
    setShowMenu(false);
  };

  const closeWeeklyReport = () => {
    setShowWeeklyReport(false);
  };

  const handleSetPin = (pin: string) => {
    setPinForUser(userId, pin);
    setShowPinSetup(false);
  };

  const handleSkipPin = () => {
    setShowPinSetup(false);
  };

  const openTaskInfo = (task: RoutineItem) => {
    setSelectedTask(task);
  };

  const closeTaskInfo = () => {
    setSelectedTask(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img
            src="/icon.png"
            alt="Routine Tracker"
            className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-md"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading your tracker...</p>
          <p className="text-sm text-indigo-600 font-semibold">
            Built with ❤️ by Tech Talk
          </p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading your progress. Please try again.</p>
          <button 
            onClick={initializeTracker}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const completionRate = calculateCompletionRate(progress.completedItems, todayRoutineItems.length);
  const currentDate = getNigerianTimeDisplay();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <img
                src="/icon.png"
                alt="Routine Tracker"
                className="w-12 h-12 rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || 'Friend'}! 👋
                </h1>
                <p className="text-gray-600">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={openWeeklyReport}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>📊</span>
                      <span>Weekly Report</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>👤</span>
                      <span>Switch User</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Todays Progress</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {progress.completedItems.length}/{todayRoutineItems.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{completionRate}%</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Routine Items */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Daily Routine Checklist ✅
          </h2>
          
          <div className="space-y-3">
            {todayRoutineItems.map((item) => {
              const isCompleted = progress.completedItems.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Info Button */}
                    {item.detailedInfo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTaskInfo(item);
                        }}
                        className="w-6 h-6 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                        title="More info"
                      >
                        <span className="text-indigo-600 text-sm font-bold">ⓘ</span>
                      </button>
                    )}

                    {/* Checkbox */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {isCompleted && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Save Status */}
          {isSaving && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span>Saving...</span>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">
            {completionRate === 100
              ? "🎉 Amazing! Youve completed all your routines today!"
              : completionRate >= 75
              ? "🔥 Youre doing great! Keep it up!"
              : completionRate >= 50
              ? "💪 Good progress! Youre halfway there!"
              : "🌱 Every step counts. Youve got this!"
            }
          </p>
          <p className="text-xs mt-2">
            Progress auto-saves • Resets at midnight • Access Weekly Report from menu
          </p>
          <p className="text-xs mt-2">
            Built with ❤️ by <span className="font-semibold text-indigo-600">Tech Talk</span>
          </p>
        </div>

        {/* Weekly Report Modal */}
        {showWeeklyReport && (
          <WeeklyReport userId={userId} onClose={closeWeeklyReport} />
        )}

        {/* Task Info Popup */}
        {selectedTask && (
          <TaskInfoPopup item={selectedTask} onClose={closeTaskInfo} />
        )}

        {/* PIN Setup Popup */}
        {showPinSetup && user && (
          <PinSetupPopup
            userName={user.name}
            onSetPin={handleSetPin}
            onSkip={handleSkipPin}
          />
        )}
      </div>
    </div>
  );
}
