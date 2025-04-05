
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEventById, registerForEvent, unregisterFromEvent } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Share, ArrowLeft, Heart, Edit, Calendar as CalendarIcon } from 'lucide-react';
import { formatDisplayDate, formatDisplayTime, convertToGoogleCalendarEvent, downloadICS } from '@/utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';
import { CompareRef } from '../services/userService';

const EventDetails = () => {
  const { eventId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        // Check if user is registered
        if (currentUser && eventData.registeredUsers) {
          setIsRegistered(CompareRef(eventData?.registeredUsers, currentUser?.uid));
        }
        
        // Check if event is saved (would come from user data in a real app)
        setIsSaved(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, currentUser]);
  
  const handleRegister = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    
    try {
      if (isRegistered) {
        // Unregister
        await unregisterFromEvent(eventId, currentUser.uid);
        setIsRegistered(false);
        
        toast({
          title: "Success",
          description: `You have been unregistered from ${event.title}.`,
        });
      } else {
        // Register
        await registerForEvent(eventId, currentUser.uid);
        setIsRegistered(true);
        
        toast({
          title: "Success",
          description: `You have been registered for ${event.title}.`,
        });
      }
    } catch (error) {
      console.error('Error registering/unregistering for event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register/unregister for the event. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSave = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save events.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    
    // Toggle saved status
    setIsSaved(!isSaved);
    
    toast({
      title: !isSaved ? "Event saved" : "Event removed",
      description: !isSaved 
        ? `${event.title} has been saved to your bookmarks.`
        : `${event.title} has been removed from your bookmarks.`
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard.",
      });
    }
  };
  
  const handleAddToCalendar = (type) => {
    if (type === 'google') {
      const googleCalendarUrl = convertToGoogleCalendarEvent(event);
      window.open(googleCalendarUrl, '_blank');
    } else if (type === 'ics') {
      downloadICS(event);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {event.posterUrl ? (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={event.posterUrl}
                alt={event.title}
                className="object-cover w-full h-[300px] md:h-[400px]"
              />
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center h-[300px] md:h-[400px]">
              <Calendar className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.category && (
                <span className={`category-badge ${event.category.toLowerCase()}-badge`}>
                  {event.category}
                </span>
              )}
              
              {event.status === 'pending' && (
                <span className="category-badge bg-yellow-100 text-yellow-800">
                  Pending Approval
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{formatDisplayDate(event.eventDate)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{formatDisplayTime(event.eventDate)}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    {event.registeredUsers?.length || 0} {event.registeredUsers?.length === 1 ? 'person' : 'people'} registered
                    {event.maxAttendees && ` (${event.maxAttendees - (event.registeredUsers?.length || 0)} spots left)`}
                  </span>
                </div>
                
                {event.organizer && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Organized by:</span>
                    <span className="ml-2">{event.organizer}</span>
                  </div>
                )}
              </div>
            </div>
            
            {event.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {event.description}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={handleRegister}
                disabled={event.status === 'pending' || (event.maxAttendees && event.registeredUsers?.length >= event.maxAttendees && !isRegistered)}
              >
                {isRegistered ? "Cancel Registration" : "Register Now"}
              </Button>
              
              <Button variant="outline" onClick={handleSave}>
                <Heart className={`h-5 w-5 mr-2 ${isSaved ? "fill-current text-red-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share className="h-5 w-5 mr-2" />
                Share
              </Button>
              
              <div className="relative inline-block">
                <Button variant="outline" onClick={() => document.getElementById('calendar-dropdown').classList.toggle('hidden')}>
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Add to Calendar
                </Button>
                <div id="calendar-dropdown" className="hidden absolute z-10 right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1">
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" 
                    onClick={() => handleAddToCalendar('google')}
                  >
                    Google Calendar
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" 
                    onClick={() => handleAddToCalendar('ics')}
                  >
                    Download .ics
                  </button>
                </div>
              </div>
              
              {currentUser && isAdmin() && (
                <Button variant="outline" asChild>
                  <Link to={`/admin/events/edit/${eventId}`}>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Event
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
