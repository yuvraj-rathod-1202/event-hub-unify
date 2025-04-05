
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getEventById, registerForEvent, unregisterFromEvent } from '@/services/eventService';
import { formatDate, formatTime } from '@/utils/calendarUtils';
import { isOnline, getCachedData, cacheDataForOffline } from '@/utils/pwaUtils';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get cached data first
        const cachedEvent = getCachedData(`event-${eventId}`);
        
        if (cachedEvent) {
          console.log('Using cached event data');
          setEvent(cachedEvent);
          
          // Check if user is registered
          if (currentUser && cachedEvent.registeredUsers) {
            setIsRegistered(cachedEvent.registeredUsers.includes(currentUser.uid));
          }
          
          setLoading(false);
        }
        
        // Fetch fresh data
        if (isOnline()) {
          const eventData = await getEventById(eventId);
          
          if (eventData) {
            setEvent(eventData);
            
            // Check if user is registered
            if (currentUser && eventData.registeredUsers) {
              setIsRegistered(eventData.registeredUsers.includes(currentUser.uid));
            }
            
            // Cache data for offline use
            cacheDataForOffline(`event-${eventId}`, eventData);
          } else {
            setError('Event not found');
          }
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.message || 'Failed to load event details');
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedEvent = getCachedData(`event-${eventId}`);
        if (cachedEvent && !event) {
          setEvent(cachedEvent);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId, currentUser]);
  
  const handleRegister = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setRegistering(true);
    
    try {
      if (isRegistered) {
        await unregisterFromEvent(eventId, currentUser.uid);
        setIsRegistered(false);
        toast({
          title: "Success",
          description: "You have been unregistered from this event."
        });
      } else {
        await registerForEvent(eventId, currentUser.uid);
        setIsRegistered(true);
        toast({
          title: "Success",
          description: "You have been registered for this event!"
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register for the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRegistering(false);
    }
  };
  
  const isEventFull = () => {
    if (!event || !event.maxAttendees) return false;
    return event.registeredUsers && event.registeredUsers.length >= event.maxAttendees;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-72 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Event</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate('/events')}>
                Back to Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/events')}>
                Explore Other Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Banner */}
        {event.imageUrl ? (
          <div className="w-full h-72 rounded-lg overflow-hidden mb-6 bg-gray-100">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-72 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-6 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{event.title}</h1>
          </div>
        )}
        
        {/* Event Title and Category */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          {event.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {event.category}
            </span>
          )}
        </div>
        
        {/* Event Details Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {/* Event Date, Time, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Date</h3>
                  <p className="text-gray-700">{formatDate(event.eventDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Time</h3>
                  <p className="text-gray-700">{formatTime(event.eventDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Location</h3>
                  <p className="text-gray-700">{event.location || 'TBA'}</p>
                </div>
              </div>
            </div>
            
            {/* Event Capacity */}
            {event.maxAttendees && (
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Capacity</h3>
                  <p className="text-gray-700">
                    {event.registeredUsers ? event.registeredUsers.length : 0} / {event.maxAttendees} registered
                  </p>
                </div>
              </div>
            )}
            
            <Separator className="my-6" />
            
            {/* Event Description */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">About This Event</h3>
              <div className="prose max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center bg-gray-50 rounded-b-lg">
            <div>
              {event.organizer && (
                <p className="text-sm text-gray-600">
                  Organized by: <span className="font-medium">{event.organizer}</span>
                </p>
              )}
            </div>
            
            <Button
              onClick={handleRegister}
              disabled={registering || (!isRegistered && isEventFull())}
              variant={isRegistered ? "outline" : "default"}
              className="min-w-[120px]"
            >
              {registering ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2" />
                  Processing...
                </>
              ) : isRegistered ? (
                "Cancel Registration"
              ) : isEventFull() ? (
                "Event Full"
              ) : (
                "Register Now"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/events')}
          >
            Back to Events
          </Button>
          
          {event.relatedLinks && event.relatedLinks.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => window.open(event.relatedLinks[0], '_blank')}
            >
              More Information
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
