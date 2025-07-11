// Real cloud sync utility using JSONBin.io
// Provides actual cross-device synchronization

import { DailyProgress, User } from '@/types';

interface CloudData {
  users: User[];
  progress: DailyProgress[];
  lastSync: string;
}

// Real cloud storage using JSONBin.io (free tier)
const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b/676b8e2fad19ca34f8c8f5a2';
const JSONBIN_ACCESS_KEY = '$2a$10$8K9wX2vN3qL5mP7rT4uE6eH1sF9dG3kJ8nM2pQ6wR5tY7zC4vB8xA';

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

// Merge cloud and local data intelligently
const mergeCloudAndLocalData = (localData: CloudData, cloudData: CloudData): CloudData => {
  // Merge users (prefer cloud data for user info, but keep all users)
  const allUsers = [...cloudData.users];
  localData.users.forEach(localUser => {
    const existsInCloud = cloudData.users.find(cloudUser => cloudUser.id === localUser.id);
    if (!existsInCloud) {
      allUsers.push(localUser);
    }
  });

  // Merge progress (keep the most recent version of each day's progress)
  const allProgress = [...cloudData.progress];
  localData.progress.forEach(localProgress => {
    const existingIndex = allProgress.findIndex(
      cloudProgress =>
        cloudProgress.userId === localProgress.userId &&
        cloudProgress.date === localProgress.date
    );

    if (existingIndex >= 0) {
      // Compare timestamps and keep the most recent
      const cloudProgress = allProgress[existingIndex];
      const localTime = new Date(localProgress.lastUpdated).getTime();
      const cloudTime = new Date(cloudProgress.lastUpdated).getTime();

      if (localTime > cloudTime) {
        console.log(`🔄 Local progress is newer for ${localProgress.date}, keeping local version`);
        allProgress[existingIndex] = localProgress;
      } else {
        console.log(`☁️ Cloud progress is newer for ${cloudProgress.date}, keeping cloud version`);
      }
    } else {
      // Progress doesn't exist in cloud, add it
      console.log(`➕ Adding local progress for ${localProgress.date} to merged data`);
      allProgress.push(localProgress);
    }
  });

  return {
    users: allUsers,
    progress: allProgress,
    lastSync: new Date().toISOString()
  };
};

// Real cloud sync to JSONBin.io
export const syncToCloud = async (): Promise<boolean> => {
  try {
    const localData = getLocalData();
    const syncData = {
      ...localData,
      lastSync: new Date().toISOString()
    };

    console.log('🔄 Uploading to cloud...', syncData);

    const response = await fetch(JSONBIN_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_ACCESS_KEY,
        'X-Bin-Name': 'routine-tracker-data'
      },
      body: JSON.stringify(syncData)
    });

    if (response.ok) {
      // Also save locally as backup
      saveLocalData(syncData);
      console.log('✅ Data uploaded to cloud successfully at', syncData.lastSync);
      return true;
    } else {
      console.error('❌ Cloud upload failed:', response.status, response.statusText);
      // Save locally as fallback
      saveLocalData(syncData);
      return false;
    }
  } catch (error) {
    console.error('❌ Cloud sync error:', error);
    // Save locally as fallback
    const localData = getLocalData();
    saveLocalData({ ...localData, lastSync: new Date().toISOString() });
    return false;
  }
};

export const syncFromCloud = async (): Promise<boolean> => {
  try {
    console.log('📥 Downloading from cloud...');

    // Get current local data before overwriting
    const localData = getLocalData();
    console.log('📱 Current local data before cloud sync:', {
      users: localData.users.length,
      progress: localData.progress.length
    });

    const response = await fetch(`${JSONBIN_API_URL}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_ACCESS_KEY
      }
    });

    if (response.ok) {
      const result = await response.json();
      const cloudData: CloudData = result.record;

      console.log('📥 Downloaded cloud data:', {
        users: cloudData.users.length,
        progress: cloudData.progress.length,
        lastSync: cloudData.lastSync
      });

      // Merge data instead of overwriting
      const mergedData = mergeCloudAndLocalData(localData, cloudData);

      console.log('🔄 Merged data:', {
        users: mergedData.users.length,
        progress: mergedData.progress.length
      });

      // Save merged data to local storage
      saveLocalData(mergedData);

      console.log('✅ Data downloaded and merged successfully');
      console.log('📱 Last cloud sync:', new Date(cloudData.lastSync).toLocaleString());
      return true;
    } else {
      console.error('❌ Cloud download failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Cloud download error:', error);
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
