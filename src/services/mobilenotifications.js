// sendNotification.js
import axios from 'axios';

const SERVER_KEY = import.meta.env.VITE_FIREBASE_SERVER_KEY;

/**
 * Sends a push notification via FCM to a specific user’s device using their FCM token.
 * @param {string} fcmToken - The FCM token of the recipient user.
 * @param {object} notification - The notification object with `title` and `body`.
 * @param {object} data - Optional custom data payload.
 */
export const sendNotificationToUser = async (fcmToken, notification, data = {}) => {
  try {
    const response = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: fcmToken,
        notification,
        data
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${SERVER_KEY}`
        }
      }
    );

    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.response?.data || error.message);
    throw error;
  }
};
