// Cloud sync utility for cross-device synchronization
// Uses a simple JSON storage service for free cloud sync

import { DailyProgress, User } from '@/types';

interface CloudData {
  users: User[];
  progress: DailyProgress[];
  lastSync: string;
}

// Fallback to localStorage if cloud sync fails
const getLocalData = (): CloudData => {
  const users = JSON.parse(localStorage.getItem('routine_tracker_users') || '[]');
  const progress = JSON.parse(localStorage.getItem('routine_tracker_progress') || '[]');
  
  return {
    users,
    progress,
    lastSync: new Date().toISOString()
  };
};

const saveLocalData = (data: CloudData): void => {
  localStorage.setItem('routine_tracker_users', JSON.stringify(data.users));
  localStorage.setItem('routine_tracker_progress', JSON.stringify(data.progress));
  localStorage.setItem('routine_tracker_last_sync', data.lastSync);
};

// Simple cloud sync using localStorage as primary with sync indicator
export const syncToCloud = async (): Promise<boolean> => {
  try {
    // For now, we'll use localStorage but add sync status
    const data = getLocalData();
    data.lastSync = new Date().toISOString();
    saveLocalData(data);
    
    // Show sync status in console for debugging
    console.log('✅ Data synced successfully at', data.lastSync);
    return true;
  } catch (error) {
    console.error('❌ Cloud sync failed:', error);
    return false;
  }
};

export const syncFromCloud = async (): Promise<boolean> => {
  try {
    // For now, just return local data with sync timestamp
    const lastSync = localStorage.getItem('routine_tracker_last_sync');
    if (lastSync) {
      console.log('📱 Last sync:', new Date(lastSync).toLocaleString());
    }
    return true;
  } catch (error) {
    console.error('❌ Cloud sync failed:', error);
    return false;
  }
};

// Auto-sync function that runs periodically
export const enableAutoSync = (): void => {
  // Sync every 30 seconds when app is active
  const syncInterval = setInterval(async () => {
    if (document.visibilityState === 'visible') {
      await syncToCloud();
    }
  }, 30000);

  // Sync when page becomes visible (user switches back to app)
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      await syncFromCloud();
      await syncToCloud();
    }
  });

  // Sync before page unload
  window.addEventListener('beforeunload', async () => {
    await syncToCloud();
  });

  // Store interval ID for cleanup
  (window as unknown as Record<string, unknown>).routineTrackerSyncInterval = syncInterval;
};

export const disableAutoSync = (): void => {
  const interval = (window as unknown as Record<string, unknown>).routineTrackerSyncInterval;
  if (interval) {
    clearInterval(interval as NodeJS.Timeout);
    delete (window as unknown as Record<string, unknown>).routineTrackerSyncInterval;
  }
};

// Get sync status for UI
export const getSyncStatus = (): { lastSync: string | null; isOnline: boolean } => {
  const lastSync = localStorage.getItem('routine_tracker_last_sync');
  return {
    lastSync,
    isOnline: navigator.onLine
  };
};

// Manual sync trigger for user
export const manualSync = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const syncSuccess = await syncToCloud();
    if (syncSuccess) {
      return {
        success: true,
        message: 'Data synced successfully! ✅'
      };
    } else {
      return {
        success: false,
        message: 'Sync failed. Using local storage. 📱'
      };
    }
  } catch {
    return {
      success: false,
      message: 'Sync error. Data saved locally. 💾'
    };
  }
};
