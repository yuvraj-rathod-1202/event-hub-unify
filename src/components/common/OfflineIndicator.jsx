
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline) {
    return null;
  }
  
  return (
    <div className={cn(
      "fixed bottom-16 inset-x-0 sm:bottom-0 z-50 flex items-center justify-center animate-fade-in",
      "transition-opacity duration-300"
    )}>
      <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 mx-4 mb-4">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
