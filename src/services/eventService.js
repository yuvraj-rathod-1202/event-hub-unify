import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  orderBy,
  limit, // Import the limit method
  startAfter,
  arrayUnion,
  arrayRemove, // Import startAfter for pagination
} from 'firebase/firestore';
import { db } from '../firebase/config';

const EVENTS_COLLECTION = 'events';
const MAX_LIMIT = 100;

// Corrected getAllEvents with limit method
export const getAllEvents = async (filterCategory = null, userLimit = 50) => {
  try {
    const limitToUse = Math.min(userLimit, MAX_LIMIT);

    let eventsQuery;
    if (filterCategory) {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('category', '==', filterCategory),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(limitToUse) // Use the limit method correctly
      );
    } else {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(limitToUse) // Use the limit method correctly
      );
    }

    const querySnapshot = await getDocs(eventsQuery);

    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate(),
      });
    });

    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Corrected getPastEvents with limit method
export const getPastEvents = async (userLimit = 20) => {
  try {
    const limitToUse = Math.min(userLimit, MAX_LIMIT);

    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      where('eventDate', '<', new Date()),
      orderBy('eventDate', 'desc'),
      limit(limitToUse) // Use the limit method correctly
    );

    const querySnapshot = await getDocs(eventsQuery);

    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate(),
      });
    });

    return events;
  } catch (error) {
    console.error('Error getting past events:', error);
    throw error;
  }
};

// Corrected getAllEventsPaginated with limit method
export const getAllEventsPaginated = async (filterCategory = null, pageSize = 10, lastDoc = null) => {
  try {
    let eventsQuery;
    if (filterCategory) {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('category', '==', filterCategory),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(pageSize), // Use the limit method correctly
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
    } else {
      eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        where('eventDate', '>=', new Date()),
        orderBy('eventDate', 'asc'),
        limit(pageSize), // Use the limit method correctly
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );
    }

    const querySnapshot = await getDocs(eventsQuery);

    const events = [];
    let newLastDoc = null;

    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate(),
      });
      newLastDoc = doc;
    });

    return { events, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error getting paginated events:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const userRef = doc(db, 'users', userId);

    await updateDoc(eventRef, {
      registeredUsers: arrayUnion(userRef),
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
}

export const unregisterFromEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const userRef = doc(db, 'users', userId);

    await updateDoc(eventRef, {
      registeredUsers: arrayRemove(userRef),
    });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    throw error;
  }
}

export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventDoc = await getDoc(eventRef);

    if (eventDoc.exists()) {
      return {
        id: eventDoc.id,
        ...eventDoc.data(),
        eventDate: eventDoc.data().eventDate?.toDate(),
      };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting event by ID:', error);
    throw error;
  }
}

export const createEvent = async (eventData) => {
  try {
    const eventRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      eventDate: new Date(eventData.eventDate),
    });
    return eventRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export const getEventsByUserId = async (userId) => {
  try {
    const eventsQuery = query(
      collection(db, EVENTS_COLLECTION),
      where('registeredUsers', 'array-contains', doc(db, 'users', userId)),
      orderBy('eventDate', 'asc')
    );

    const querySnapshot = await getDocs(eventsQuery);

    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate(),
      });
    });

    return events;
  } catch (error) {
    console.error('Error getting events by user ID:', error);
    throw error;
  }
}

export const changeEventStatus = async (eventId, status) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      status: status,
    });
  } catch (error) {
    console.error('Error changing event status:', error);
    throw error;
  }
}