
// PWA Utilities

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('Service worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  } else {
    console.log('Service workers are not supported in this browser');
    return null;
  }
};

// Check if app is installed (Add to Home Screen)
export const checkIfInstalled = () => {
  let isInstalled = false;
  
  // iOS detection
  if (window.navigator.standalone) {
    isInstalled = true;
  }
  
  // Android/Chrome detection
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled = true;
  }
  
  return isInstalled;
};

// Check if can be installed
export const checkIfCanBeInstalled = () => {
  return Boolean(window.deferredPrompt);
};

// Show install prompt
export const showInstallPrompt = async () => {
  const promptEvent = window.deferredPrompt;
  
  if (!promptEvent) {
    return false;
  }
  
  // Show prompt
  promptEvent.prompt();
  
  // Wait for user choice
  const { outcome } = await promptEvent.userChoice;
  
  // Reset the deferred prompt
  window.deferredPrompt = null;
  
  return outcome === 'accepted';
};

// Listen for install prompt event
export const listenForInstallPrompt = (callback) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    window.deferredPrompt = e;
    
    // Update UI or notify
    if (callback && typeof callback === 'function') {
      callback(true);
    }
  });
  
  // Listen for when the app is installed
  window.addEventListener('appinstalled', () => {
    // Clear prompt
    window.deferredPrompt = null;
    
    // Update UI or notify
    if (callback && typeof callback === 'function') {
      callback(false);
    }
    
    console.log('PWA was installed');
  });
};

// Check if online
export const isOnline = () => {
  return navigator.onLine;
};

// Listen for online/offline status
export const listenForConnectivityChanges = (onlineCallback, offlineCallback) => {
  window.addEventListener('online', () => {
    if (onlineCallback && typeof onlineCallback === 'function') {
      onlineCallback();
    }
  });
  
  window.addEventListener('offline', () => {
    if (offlineCallback && typeof offlineCallback === 'function') {
      offlineCallback();
    }
  });
};

// Cache data for offline use
export const cacheDataForOffline = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

// Get cached data
export const getCachedData = (key, maxAge = 24 * 60 * 60 * 1000) => { // Default: 24 hours
  try {
    const cachedData = localStorage.getItem(key);
    
    if (!cachedData) {
      return null;
    }
    
    const { timestamp, data } = JSON.parse(cachedData);
    
    // Check if data is still valid
    if (Date.now() - timestamp > maxAge) {
      // Data is too old, remove it
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

// Clear cached data
export const clearCachedData = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      // Clear all cached data
      localStorage.clear();
    }
    return true;
  } catch (error) {
    console.error('Error clearing cached data:', error);
    return false;
  }
};
