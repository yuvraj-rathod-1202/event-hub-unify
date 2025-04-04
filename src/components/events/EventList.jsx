
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EventCard from './EventCard';
import { toast } from '@/components/ui/use-toast';
import { registerForEvent, unregisterFromEvent } from '@/services/eventService';
import { isOnline, getCachedData, cacheDataForOffline } from '@/utils/pwaUtils';

const EventList = ({ events, onEventUpdate }) => {
  const { currentUser } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [savedEvents, setSavedEvents] = useState({});
  
  useEffect(() => {
    if (currentUser && events.length > 0) {
      // Initialize registration status for each event
      const registrationStatus = {};
      const savedStatus = {};
      
      events.forEach(event => {
        const isRegistered = event.registeredUsers && event.registeredUsers.includes(currentUser.uid);
        registrationStatus[event.id] = isRegistered;
        
        // Check if event is saved (this would come from user data in a real app)
        savedStatus[event.id] = false; // Default false, to be updated from user preferences
      });
      
      setRegisteredEvents(registrationStatus);
      setSavedEvents(savedStatus);
    }
  }, [currentUser, events]);
  
  const handleRegisterEvent = async (eventId) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const event = events.find(e => e.id === eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      if (registeredEvents[eventId]) {
        // User is already registered, unregister them
        await unregisterFromEvent(eventId, currentUser.uid);
        
        toast({
          title: "Success",
          description: `You have been unregistered from ${event.title}.`,
        });
        
        setRegisteredEvents(prev => ({
          ...prev,
          [eventId]: false
        }));
      } else {
        // Register the user
        await registerForEvent(eventId, currentUser.uid);
        
        toast({
          title: "Success",
          description: `You have been registered for ${event.title}.`,
        });
        
        setRegisteredEvents(prev => ({
          ...prev,
          [eventId]: true
        }));
      }
      
      if (onEventUpdate) {
        onEventUpdate();
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register for the event. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveEvent = (eventId) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save events.",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle saved status
    setSavedEvents(prev => {
      const newSavedStatus = {
        ...prev,
        [eventId]: !prev[eventId]
      };
      
      // In a real app, you would update this in user preferences in Firestore
      const event = events.find(e => e.id === eventId);
      
      toast({
        title: newSavedStatus[eventId] ? "Event saved" : "Event removed",
        description: newSavedStatus[eventId] 
          ? `${event.title} has been saved to your bookmarks.`
          : `${event.title} has been removed from your bookmarks.`
      });
      
      return newSavedStatus;
    });
  };
  
  // Check if an event is full
  const isEventFull = (event) => {
    if (!event.maxAttendees) return false;
    return event.registeredUsers && event.registeredUsers.length >= event.maxAttendees;
  };
  
  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600">Check back later for upcoming events.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={handleRegisterEvent}
          isRegistered={registeredEvents[event.id]}
          isFull={isEventFull(event)}
          onSave={handleSaveEvent}
          isSaved={savedEvents[event.id]}
        />
      ))}
    </div>
  );
};

export default EventList;
