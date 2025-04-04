
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const NOTICES_COLLECTION = 'notices';

// Get all notices
export const getAllNotices = async (filterCategory = null, limitNum = 50) => {
  try {
    let noticesQuery;
    
    if (filterCategory) {
      noticesQuery = query(
        collection(db, NOTICES_COLLECTION),
        where('category', '==', filterCategory),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      );
    } else {
      noticesQuery = query(
        collection(db, NOTICES_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      );
    }
    
    const querySnapshot = await getDocs(noticesQuery);
    
    const notices = [];
    querySnapshot.forEach((doc) => {
      notices.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return notices;
  } catch (error) {
    console.error('Error getting notices:', error);
    throw error;
  }
};

// Get notice by ID
export const getNoticeById = async (noticeId) => {
  try {
    const noticeDoc = await getDoc(doc(db, NOTICES_COLLECTION, noticeId));
    
    if (!noticeDoc.exists()) {
      throw new Error('Notice not found');
    }
    
    const noticeData = noticeDoc.data();
    
    return {
      id: noticeDoc.id,
      ...noticeData,
      createdAt: noticeData.createdAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting notice:', error);
    throw error;
  }
};

// Create notice
export const createNotice = async (noticeData) => {
  try {
    // Create notice document
    const newNotice = {
      ...noticeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, NOTICES_COLLECTION), newNotice);
    
    return {
      id: docRef.id,
      ...newNotice
    };
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};

// Update notice
export const updateNotice = async (noticeId, noticeData) => {
  try {
    const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
    
    // Update notice document
    const updatedNotice = {
      ...noticeData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(noticeRef, updatedNotice);
    
    return {
      id: noticeId,
      ...updatedNotice
    };
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};

// Delete notice
export const deleteNotice = async (noticeId) => {
  try {
    await deleteDoc(doc(db, NOTICES_COLLECTION, noticeId));
    return true;
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
};

// Save notice for user
export const saveNoticeForUser = async (noticeId, userId) => {
  try {
    // Get user document
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    // Add notice to saved notices
    const savedNotices = userDoc.data().savedNotices || [];
    
    // Check if notice is already saved
    if (savedNotices.includes(noticeId)) {
      throw new Error('Notice already saved');
    }
    
    await updateDoc(doc(db, 'users', userId), {
      savedNotices: [...savedNotices, noticeId]
    });
    
    return true;
  } catch (error) {
    console.error('Error saving notice:', error);
    throw error;
  }
};

// Unsave notice for user
export const unsaveNoticeForUser = async (noticeId, userId) => {
  try {
    // Get user document
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    // Remove notice from saved notices
    const savedNotices = userDoc.data().savedNotices || [];
    
    await updateDoc(doc(db, 'users', userId), {
      savedNotices: savedNotices.filter(id => id !== noticeId)
    });
    
    return true;
  } catch (error) {
    console.error('Error unsaving notice:', error);
    throw error;
  }
};

// Get saved notices for user
export const getSavedNoticesForUser = async (userId) => {
  try {
    // Get user document
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    // Get saved notice IDs
    const savedNoticeIds = userDoc.data().savedNotices || [];
    
    if (savedNoticeIds.length === 0) {
      return [];
    }
    
    // Get notices by IDs
    const notices = [];
    
    for (const noticeId of savedNoticeIds) {
      try {
        const noticeDoc = await getDoc(doc(db, NOTICES_COLLECTION, noticeId));
        
        if (noticeDoc.exists()) {
          const noticeData = noticeDoc.data();
          
          notices.push({
            id: noticeDoc.id,
            ...noticeData,
            createdAt: noticeData.createdAt?.toDate()
          });
        }
      } catch (error) {
        console.error(`Error getting notice ${noticeId}:`, error);
      }
    }
    
    return notices;
  } catch (error) {
    console.error('Error getting saved notices:', error);
    throw error;
  }
};
