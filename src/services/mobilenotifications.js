export const sendNotificationToMobile = async (userId, message) => {
    try{
        if(askNotificationPermission()){
        self.addEventListener('push', () => {
            const notificationOptions = {
                body: message,
                icon: '../../public/icons/icon-192x192.png',
                badge: '../../public/icons/icon-192x192.png',
            };
            self.registration.showNotification('New Notification', notificationOptions);
        })
    }
    }catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }

}

const askNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('✅ Notification permission granted.');
      return true;
    } else {
      console.log('❌ Notification permission denied.');
        return false;
    }
  };
  