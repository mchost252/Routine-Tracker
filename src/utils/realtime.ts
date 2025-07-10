// Real-time data tracking utilities for the Digital Routine & Results Tracker
// Provides real-time synchronization across browser tabs and sessions

import { DailyProgress, User, getCurrentDate } from '@/types';

// Event types for real-time updates
export type RealtimeEventType = 
  | 'progress_updated' 
  | 'user_joined' 
  | 'user_left'
  | 'daily_reset';

export interface RealtimeEvent {
  type: RealtimeEventType;
  userId: string;
  data: Record<string, unknown> | DailyProgress | User | null;
  timestamp: string;
}

// Real-time event listeners
type EventListener = (event: RealtimeEvent) => void;
const eventListeners: Map<RealtimeEventType, EventListener[]> = new Map();

// Initialize real-time system
export const initializeRealtime = () => {
  // Listen for localStorage changes (cross-tab communication)
  window.addEventListener('storage', handleStorageChange);
  
  // Listen for visibility changes (tab focus/blur)
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Periodic sync check (every 30 seconds)
  setInterval(performPeriodicSync, 30000);
};

// Clean up real-time system
export const cleanupRealtime = () => {
  window.removeEventListener('storage', handleStorageChange);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
};

// Handle localStorage changes from other tabs
const handleStorageChange = (event: StorageEvent) => {
  if (!event.key || !event.newValue) return;
  
  // Check if it's a routine tracker related change
  if (event.key.startsWith('routine_progress_')) {
    const parts = event.key.split('_');
    if (parts.length >= 4) {
      const userId = parts.slice(2, -1).join('_');
      const date = parts[parts.length - 1];
      
      if (date === getCurrentDate()) {
        const progress: DailyProgress = JSON.parse(event.newValue);
        emitEvent({
          type: 'progress_updated',
          userId,
          data: progress,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  // Check for user changes
  if (event.key === 'routine_tracker_current_user') {
    if (event.newValue) {
      emitEvent({
        type: 'user_joined',
        userId: event.newValue,
        data: null,
        timestamp: new Date().toISOString()
      });
    } else if (event.oldValue) {
      emitEvent({
        type: 'user_left',
        userId: event.oldValue,
        data: null,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Handle tab visibility changes
const handleVisibilityChange = () => {
  if (!document.hidden) {
    // Tab became visible, perform sync
    performPeriodicSync();
  }
};

// Perform periodic synchronization
const performPeriodicSync = () => {
  // Check for daily reset
  const lastSyncDate = localStorage.getItem('routine_last_sync_date');
  const currentDate = getCurrentDate();
  
  if (lastSyncDate && lastSyncDate !== currentDate) {
    // Day has changed, emit daily reset event
    emitEvent({
      type: 'daily_reset',
      userId: 'system',
      data: { previousDate: lastSyncDate, currentDate },
      timestamp: new Date().toISOString()
    });
  }
  
  localStorage.setItem('routine_last_sync_date', currentDate);
};

// Emit real-time event
const emitEvent = (event: RealtimeEvent) => {
  const listeners = eventListeners.get(event.type) || [];
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Error in realtime event listener:', error);
    }
  });
};

// Subscribe to real-time events
export const subscribeToRealtimeEvents = (
  eventType: RealtimeEventType,
  listener: EventListener
): (() => void) => {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, []);
  }
  
  const listeners = eventListeners.get(eventType)!;
  listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Broadcast progress update to other tabs
export const broadcastProgressUpdate = (userId: string, progress: DailyProgress) => {
  // The storage event will be automatically triggered when we save to localStorage
  // This ensures all tabs get notified of the change
  
  // Also emit locally for immediate feedback
  emitEvent({
    type: 'progress_updated',
    userId,
    data: progress,
    timestamp: new Date().toISOString()
  });
};

// Get real-time statistics
export const getRealtimeStats = () => {
  const stats = {
    activeListeners: 0,
    lastSyncDate: localStorage.getItem('routine_last_sync_date'),
    currentDate: getCurrentDate(),
    isRealtime: true
  };
  
  eventListeners.forEach(listeners => {
    stats.activeListeners += listeners.length;
  });
  
  return stats;
};

// Force sync with latest data
export const forceSyncData = () => {
  performPeriodicSync();
  
  // Trigger a storage event to notify other tabs
  const syncEvent = new StorageEvent('storage', {
    key: 'routine_sync_trigger',
    newValue: new Date().toISOString(),
    oldValue: null,
    storageArea: localStorage
  });
  
  window.dispatchEvent(syncEvent);
};
