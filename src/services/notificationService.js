import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const getNotifications = async () => {
    try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
    
        const notifications = [];
        querySnapshot.forEach((doc) => {
        notifications.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate(),
        });
        });
    
        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
}

export const sendNotification = async (notification) => {
    try {
        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
            ...notification,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
}

export const getNotificationsForUser = async (userId) => {
    try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(notificationsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
    
        const notifications = [];
        querySnapshot.forEach((doc) => {
            notifications.push({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate(),
            });
        });
    
        return notifications;
    } catch (error) {
        console.error('Error getting notifications for user:', error);
        throw error;
    }
}

export const sendNotificationToUser = async (userId, message) => {
    try {
        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
            userId,
            message,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error sending notification to user:', error);
        throw error;
    }
}