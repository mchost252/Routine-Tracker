// Local storage utilities for the Digital Routine & Results Tracker
import { User, DailyProgress, HistoricalData, getCurrentDate } from '@/types';

const STORAGE_KEYS = {
  USERS: 'routine_tracker_users',
  DAILY_PROGRESS: 'routine_tracker_daily_progress',
  HISTORICAL_DATA: 'routine_tracker_historical_data',
  CURRENT_USER: 'routine_tracker_current_user'
};

// User management
export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

export const getUserByName = (name: string): User | null => {
  const users = getUsers();
  return users.find(u => u.name.toLowerCase() === name.toLowerCase()) || null;
};

export const setCurrentUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

// PIN management functions
export const hashPin = (pin: string): string => {
  // Simple hash function for PIN (in production, use a proper hashing library)
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
};

export const setPinForUser = (userId: string, pin: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].pin = hashPin(pin);
    users[userIndex].hasPinSetup = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export const verifyPin = (userId: string, pin: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user || !user.pin) return false;
  return user.pin === hashPin(pin);
};

export const userHasPin = (userId: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return !!(user && user.hasPinSetup);
};

// Daily progress management
export const saveDailyProgress = (progress: DailyProgress): void => {
  if (typeof window === 'undefined') return;
  
  const allProgress = getDailyProgress();
  const key = `${progress.userId}_${progress.date}`;
  allProgress[key] = progress;
  
  localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
};

export const getDailyProgress = (): Record<string, DailyProgress> => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  return stored ? JSON.parse(stored) : {};
};

export const getTodayProgress = (userId: string): DailyProgress | null => {
  const allProgress = getDailyProgress();
  const key = `${userId}_${getCurrentDate()}`;
  return allProgress[key] || null;
};

export const getUserProgress = (userId: string, date: string): DailyProgress | null => {
  const allProgress = getDailyProgress();
  const key = `${userId}_${date}`;
  return allProgress[key] || null;
};

// Historical data management
export const saveHistoricalData = (data: HistoricalData): void => {
  if (typeof window === 'undefined') return;
  
  const allHistorical = getHistoricalData();
  const key = `${data.userId}_${data.date}`;
  allHistorical[key] = data;
  
  localStorage.setItem(STORAGE_KEYS.HISTORICAL_DATA, JSON.stringify(allHistorical));
};

export const getHistoricalData = (): Record<string, HistoricalData> => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEYS.HISTORICAL_DATA);
  return stored ? JSON.parse(stored) : {};
};

export const getUserHistoricalData = (userId: string, days: number = 30): HistoricalData[] => {
  const allHistorical = getHistoricalData();
  const userHistorical: HistoricalData[] = [];
  
  // Get last N days of data
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const key = `${userId}_${dateStr}`;
    
    if (allHistorical[key]) {
      userHistorical.push(allHistorical[key]);
    }
  }
  
  return userHistorical.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Daily reset logic
export const checkAndPerformDailyReset = (userId: string): boolean => {
  const todayProgress = getTodayProgress(userId);

  // If no progress for today, check if we need to archive yesterday's data
  if (!todayProgress) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const yesterdayProgress = getUserProgress(userId, yesterdayStr);
    if (yesterdayProgress) {
      // Archive yesterday's progress to historical data
      const historicalData: HistoricalData = {
        userId: yesterdayProgress.userId,
        date: yesterdayProgress.date,
        completedItems: yesterdayProgress.completedItems,
        completionRate: Math.round((yesterdayProgress.completedItems.length / 8) * 100), // 8 default items
        streak: calculateStreak(userId, yesterdayStr)
      };
      
      saveHistoricalData(historicalData);
    }
    
    return true; // New day, reset needed
  }
  
  return false; // Same day, no reset needed
};

// Calculate current streak
export const calculateStreak = (userId: string, endDate: string): number => {
  let streak = 0;
  const date = new Date(endDate);
  
  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    const progress = getUserProgress(userId, dateStr);
    
    if (progress && progress.completedItems.length > 0) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
