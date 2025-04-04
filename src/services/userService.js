
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return {
      uid: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user interests
export const updateUserInterests = async (userId, interests) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      interests,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user interests:', error);
    throw error;
  }
};

// Add interest
export const addUserInterest = async (userId, interest) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      interests: arrayUnion(interest),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding user interest:', error);
    throw error;
  }
};

// Remove interest
export const removeUserInterest = async (userId, interest) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      interests: arrayRemove(interest),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error removing user interest:', error);
    throw error;
  }
};

// Add FCM token
export const addFcmToken = async (userId, token) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding FCM token:', error);
    throw error;
  }
};

// Remove FCM token
export const removeFcmToken = async (userId, token) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      fcmTokens: arrayRemove(token),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    throw error;
  }
};

// Get user's registered events
export const getUserRegisteredEvents = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return userDoc.data().registeredEvents || [];
  } catch (error) {
    console.error('Error getting user registered events:', error);
    throw error;
  }
};

// Get user's club memberships
export const getUserClubMemberships = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return userDoc.data().clubMemberships || [];
  } catch (error) {
    console.error('Error getting user club memberships:', error);
    throw error;
  }
};

// Get user's saved notices
export const getUserSavedNotices = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return userDoc.data().savedNotices || [];
  } catch (error) {
    console.error('Error getting user saved notices:', error);
    throw error;
  }
};
