
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const CLUBS_COLLECTION = 'clubs';

// Get all clubs
export const getAllClubs = async (filterCategory = null, limitNum = 50) => {
  try {
    let clubsQuery;
    
    if (filterCategory) {
      clubsQuery = query(
        collection(db, CLUBS_COLLECTION),
        where('category', '==', filterCategory),
        orderBy('name', 'asc'),
        limit(limitNum)
      );
    } else {
      clubsQuery = query(
        collection(db, CLUBS_COLLECTION),
        orderBy('name', 'asc'),
        limit(limitNum)
      );
    }
    
    const querySnapshot = await getDocs(clubsQuery);
    
    const clubs = [];
    querySnapshot.forEach((doc) => {
      clubs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return clubs;
  } catch (error) {
    console.error('Error getting clubs:', error);
    throw error;
  }
};

// Get club by ID
export const getClubById = async (clubId) => {
  try {
    const clubDoc = await getDoc(doc(db, CLUBS_COLLECTION, clubId));
    
    if (!clubDoc.exists()) {
      throw new Error('Club not found');
    }
    
    return {
      id: clubDoc.id,
      ...clubDoc.data()
    };
  } catch (error) {
    console.error('Error getting club:', error);
    throw error;
  }
};

// Create club
export const createClub = async (clubData, logoFile) => {
  try {
    // Upload logo if provided
    let logoUrl = null;
    
    if (logoFile) {
      const fileRef = ref(storage, `club-logos/${Date.now()}-${logoFile.name}`);
      await uploadBytes(fileRef, logoFile);
      logoUrl = await getDownloadURL(fileRef);
    }
    
    // Create club document
    const newClub = {
      ...clubData,
      logoUrl,
      members: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, CLUBS_COLLECTION), newClub);
    
    return {
      id: docRef.id,
      ...newClub
    };
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

// Update club
export const updateClub = async (clubId, clubData, logoFile) => {
  try {
    const clubRef = doc(db, CLUBS_COLLECTION, clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (!clubDoc.exists()) {
      throw new Error('Club not found');
    }
    
    // Upload new logo if provided
    let logoUrl = clubDoc.data().logoUrl;
    
    if (logoFile) {
      // Delete old logo if exists
      if (logoUrl) {
        try {
          const oldLogoRef = ref(storage, logoUrl);
          await deleteObject(oldLogoRef);
        } catch (error) {
          console.error('Error deleting old logo:', error);
        }
      }
      
      // Upload new logo
      const fileRef = ref(storage, `club-logos/${Date.now()}-${logoFile.name}`);
      await uploadBytes(fileRef, logoFile);
      logoUrl = await getDownloadURL(fileRef);
    }
    
    // Update club document
    const updatedClub = {
      ...clubData,
      logoUrl,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(clubRef, updatedClub);
    
    return {
      id: clubId,
      ...updatedClub
    };
  } catch (error) {
    console.error('Error updating club:', error);
    throw error;
  }
};

// Delete club
export const deleteClub = async (clubId) => {
  try {
    const clubRef = doc(db, CLUBS_COLLECTION, clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (!clubDoc.exists()) {
      throw new Error('Club not found');
    }
    
    // Delete logo if exists
    const logoUrl = clubDoc.data().logoUrl;
    if (logoUrl) {
      try {
        const logoRef = ref(storage, logoUrl);
        await deleteObject(logoRef);
      } catch (error) {
        console.error('Error deleting logo:', error);
      }
    }
    
    // Delete club document
    await deleteDoc(clubRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
};

// Join club
export const joinClub = async (clubId, userId) => {
  try {
    const clubRef = doc(db, CLUBS_COLLECTION, clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (!clubDoc.exists()) {
      throw new Error('Club not found');
    }
    
    // Add user to members
    const currentMembers = clubDoc.data().members || [];
    
    // Check if user is already a member
    if (currentMembers.includes(userId)) {
      throw new Error('User is already a member of this club');
    }
    
    await updateDoc(clubRef, {
      members: [...currentMembers, userId],
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error joining club:', error);
    throw error;
  }
};

// Leave club
export const leaveClub = async (clubId, userId) => {
  try {
    const clubRef = doc(db, CLUBS_COLLECTION, clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (!clubDoc.exists()) {
      throw new Error('Club not found');
    }
    
    // Remove user from members
    const currentMembers = clubDoc.data().members || [];
    
    await updateDoc(clubRef, {
      members: currentMembers.filter(id => id !== userId),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error leaving club:', error);
    throw error;
  }
};

// Get clubs by user ID (clubs where user is a member)
export const getClubsByUserId = async (userId) => {
  try {
    const clubsQuery = query(
      collection(db, CLUBS_COLLECTION),
      where('members', 'array-contains', userId),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(clubsQuery);
    
    const clubs = [];
    querySnapshot.forEach((doc) => {
      clubs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return clubs;
  } catch (error) {
    console.error('Error getting user clubs:', error);
    throw error;
  }
};
