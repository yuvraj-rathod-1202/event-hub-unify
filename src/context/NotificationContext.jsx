
import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { initializeMessaging } from '../firebase/config';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [messaging, setMessaging] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  
  // Initialize FCM
  useEffect(() => {
    const initFCM = async () => {
      try {
        const messagingInstance = await initializeMessaging();
        if (messagingInstance) {
          setMessaging(messagingInstance);
          
          // Check permission status
          const permission = Notification.permission;
          setNotificationPermission(permission);
          
          // Initialize listener for foreground messages
          onMessage(messagingInstance, (payload) => {
            console.log('Message received:', payload);
            toast({
              title: payload.notification.title,
              description: payload.notification.body,
            });
          });
        }
      } catch (error) {
        console.error('Error initializing messaging:', error);
      }
    };
    
    initFCM();
  }, []);
  
  // Request permission and get FCM token
  const requestNotificationPermission = async () => {
    try {
      if (!messaging) {
        console.log('Messaging not initialized');
        return false;
      }
      
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // Replace with your VAPID key
        });
        
        if (token) {
          setFcmToken(token);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };
  
  // Subscribe to a topic
  const subscribeToTopic = async (topic) => {
    try {
      if (!currentUser || !fcmToken) {
        console.log('User not logged in or FCM token not available');
        return false;
      }
      
      // This would typically be done via your backend
      console.log(`Subscribed to topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  };
  
  // Unsubscribe from a topic
  const unsubscribeFromTopic = async (topic) => {
    try {
      if (!currentUser || !fcmToken) {
        console.log('User not logged in or FCM token not available');
        return false;
      }
      
      // This would typically be done via your backend
      console.log(`Unsubscribed from topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  };
  
  const value = {
    notificationPermission,
    fcmToken,
    requestNotificationPermission,
    subscribeToTopic,
    unsubscribeFromTopic
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
