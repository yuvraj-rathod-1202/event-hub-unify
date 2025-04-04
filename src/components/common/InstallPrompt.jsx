
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { checkIfCanBeInstalled, showInstallPrompt, listenForInstallPrompt } from '@/utils/pwaUtils';
import { X } from 'lucide-react';

const InstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  useEffect(() => {
    // Check if the PWA can be installed
    setCanInstall(checkIfCanBeInstalled());
    
    // Listen for the beforeinstallprompt event
    listenForInstallPrompt((canBeInstalled) => {
      setCanInstall(canBeInstalled);
    });
    
    // Check if the user has dismissed the prompt
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);
  
  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    
    if (installed) {
      setCanInstall(false);
    }
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('installPromptDismissed', 'true');
  };
  
  if (!canInstall || isDismissed) {
    return null;
  }
  
  return (
    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4 mx-4 relative animate-fade-in">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Install EventHub Unify</h3>
      <p className="text-gray-600 mb-4">
        Install our app to your home screen for quick access and offline functionality.
      </p>
      <Button onClick={handleInstall}>
        Install Now
      </Button>
    </div>
  );
};

export default InstallPrompt;
