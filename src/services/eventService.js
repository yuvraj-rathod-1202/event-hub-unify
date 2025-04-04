
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

const EVENTS_COLLECTION = 'events';

// Get all events
export const getAllEvents = async (filterCategory = null, limit = 50) => {
  try {
    let eventsQuery;
    
    if (filterCategory) {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('category', '==', filterCategory),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(limit)
      );
    } else {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(limit)
      );
    }
    
    const querySnapshot = await getDocs(eventsQuery);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Get past events
export const getPastEvents = async (limit = 20) => {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      where('eventDate', '<', new Date()),
      orderBy('eventDate', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error getting past events:', error);
    throw error;
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    const eventData = eventDoc.data();
    
    return {
      id: eventDoc.id,
      ...eventData,
      eventDate: eventData.eventDate?.toDate()
    };
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

// Create event
export const createEvent = async (eventData, posterFile) => {
  try {
    // Upload poster if provided
    let posterUrl = null;
    
    if (posterFile) {
      const fileRef = ref(storage, `event-posters/${Date.now()}-${posterFile.name}`);
      await uploadBytes(fileRef, posterFile);
      posterUrl = await getDownloadURL(fileRef);
    }
    
    // Create event document
    const newEvent = {
      ...eventData,
      posterUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending' // pending, approved, rejected
    };
    
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), newEvent);
    
    return {
      id: docRef.id,
      ...newEvent
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (eventId, eventData, posterFile) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    // Upload new poster if provided
    let posterUrl = eventDoc.data().posterUrl;
    
    if (posterFile) {
      // Delete old poster if exists
      if (posterUrl) {
        try {
          const oldPosterRef = ref(storage, posterUrl);
          await deleteObject(oldPosterRef);
        } catch (error) {
          console.error('Error deleting old poster:', error);
        }
      }
      
      // Upload new poster
      const fileRef = ref(storage, `event-posters/${Date.now()}-${posterFile.name}`);
      await uploadBytes(fileRef, posterFile);
      posterUrl = await getDownloadURL(fileRef);
    }
    
    // Update event document
    const updatedEvent = {
      ...eventData,
      posterUrl,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(eventRef, updatedEvent);
    
    return {
      id: eventId,
      ...updatedEvent
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    // Delete poster if exists
    const posterUrl = eventDoc.data().posterUrl;
    if (posterUrl) {
      try {
        const posterRef = ref(storage, posterUrl);
        await deleteObject(posterRef);
      } catch (error) {
        console.error('Error deleting poster:', error);
      }
    }
    
    // Delete event document
    await deleteDoc(eventRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Change event status (approve/reject)
export const changeEventStatus = async (eventId, status) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    
    await updateDoc(eventRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error changing event status:', error);
    throw error;
  }
};

// Register user for event
export const registerForEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    // Add user to registered users
    const currentRegistrations = eventDoc.data().registeredUsers || [];
    
    // Check if user is already registered
    if (currentRegistrations.includes(userId)) {
      throw new Error('User already registered for this event');
    }
    
    await updateDoc(eventRef, {
      registeredUsers: [...currentRegistrations, userId],
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Unregister user from event
export const unregisterFromEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }
    
    // Remove user from registered users
    const currentRegistrations = eventDoc.data().registeredUsers || [];
    
    await updateDoc(eventRef, {
      registeredUsers: currentRegistrations.filter(id => id !== userId),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error unregistering from event:', error);
    throw error;
  }
};

// Get events by user ID (registered events)
export const getEventsByUserId = async (userId) => {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      where('registeredUsers', 'array-contains', userId),
      orderBy('eventDate', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
};
