'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_ROUTINE_ITEMS, DailyProgress, calculateCompletionRate } from '@/types';
import { getUserProgress } from '@/utils/storage';

interface WeeklyReportProps {
  userId: string;
  onClose: () => void;
}

interface WeeklyData {
  date: string;
  dayName: string;
  progress: DailyProgress | null;
  completionRate: number;
}

export function WeeklyReport({ userId, onClose }: WeeklyReportProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = last week, etc.

  useEffect(() => {
    loadWeeklyData();
  }, [userId, selectedWeek]);

  const loadWeeklyData = () => {
    setIsLoading(true);
    const data: WeeklyData[] = [];
    
    // Get the start of the selected week (Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay - (selectedWeek * 7));
    
    // Generate 7 days of data
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const progress = getUserProgress(userId, dateStr);
      const completionRate = progress 
        ? calculateCompletionRate(progress.completedItems, DEFAULT_ROUTINE_ITEMS.length)
        : 0;
      
      data.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        progress,
        completionRate
      });
    }
    
    setWeeklyData(data);
    setIsLoading(false);
  };

  const getWeekTitle = () => {
    if (selectedWeek === 0) return 'This Week';
    if (selectedWeek === 1) return 'Last Week';
    return `${selectedWeek + 1} Weeks Ago`;
  };

  const getWeeklyAverage = () => {
    const totalRate = weeklyData.reduce((sum, day) => sum + day.completionRate, 0);
    return Math.round(totalRate / weeklyData.length);
  };

  const getBestDay = () => {
    return weeklyData.reduce((best, day) => 
      day.completionRate > best.completionRate ? day : best
    );
  };

  const getStreakDays = () => {
    return weeklyData.filter(day => day.completionRate > 0).length;
  };

  const getTaskStats = () => {
    const taskStats = DEFAULT_ROUTINE_ITEMS.map(item => {
      const completedDays = weeklyData.filter(day => 
        day.progress?.completedItems.includes(item.id)
      ).length;
      
      return {
        ...item,
        completedDays,
        percentage: Math.round((completedDays / 7) * 100)
      };
    });
    
    return taskStats.sort((a, b) => b.percentage - a.percentage);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weekly report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src="/icon.png"
              alt="Routine Tracker"
              className="w-10 h-10 rounded-lg shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Weekly Report</h2>
              <p className="text-gray-600">{getWeekTitle()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Week Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Previous week"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 min-w-[100px] text-center">{getWeekTitle()}</span>
              <button
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next week"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Weekly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{getWeeklyAverage()}%</div>
              <div className="text-sm text-indigo-700">Weekly Average</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getStreakDays()}/7</div>
              <div className="text-sm text-green-700">Active Days</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{getBestDay().completionRate}%</div>
              <div className="text-sm text-purple-700">Best Day ({getBestDay().dayName})</div>
            </div>
          </div>
          
          {/* Daily Progress Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Progress</h3>
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 mb-2">{day.dayName}</div>
                  <div className="bg-gray-200 rounded-lg h-24 flex items-end justify-center p-1">
                    <div 
                      className={`w-full rounded transition-all duration-300 ${
                        day.completionRate >= 80 ? 'bg-green-500' :
                        day.completionRate >= 60 ? 'bg-yellow-500' :
                        day.completionRate >= 40 ? 'bg-orange-500' :
                        day.completionRate > 0 ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                      style={{ height: `${Math.max(day.completionRate, 5)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{day.completionRate}%</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Task Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Performance</h3>
            <div className="space-y-3">
              {getTaskStats().map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{task.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-600">{task.completedDays}/7 days completed</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          task.percentage >= 80 ? 'bg-green-500' :
                          task.percentage >= 60 ? 'bg-yellow-500' :
                          task.percentage >= 40 ? 'bg-orange-500' :
                          task.percentage > 0 ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${task.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{task.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-3"
          >
            Close Report
          </button>
          <p className="text-center text-xs text-gray-500">
            Built with ❤️ by <span className="font-semibold text-indigo-600">Tech Talk</span>
          </p>
        </div>
      </div>
    </div>
  );
}
