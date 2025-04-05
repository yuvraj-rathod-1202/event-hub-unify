
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllEvents } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import EventList from '@/components/events/EventList';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const UpcomingEvents = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      try {
        // Try to get cached data first
        const cachedEvents = getCachedData('upcomingEvents');
        
        if (cachedEvents) {
          console.log('Using cached upcoming events data');
          setEvents(cachedEvents);
          setLoading(false);
        }
        
        // Fetch fresh data
        const eventsData = await getAllEvents(null, 10);
        
        setEvents(eventsData);
        
        // Cache data for offline use
        cacheDataForOffline('upcomingEvents', eventsData);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedEvents = getCachedData('upcomingEvents');
        if (cachedEvents && events.length === 0) {
          console.log('Using cached upcoming events data after error');
          setEvents(cachedEvents);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleEventUpdate = async () => {
    // Refetch events after an update
    try {
      const eventsData = await getAllEvents(null, 10);
      setEvents(eventsData);
      cacheDataForOffline('upcomingEvents', eventsData);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
            <p className="text-gray-600 mt-1">Don't miss out on the latest happenings</p>
          </div>
          
          {currentUser && (
            <Button onClick={() => navigate('/events/add')} className="mt-4 md:mt-0">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <EventList events={events} onEventUpdate={handleEventUpdate} />
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-600 mb-4">Check back later for new events.</p>
            {currentUser && (
              <Button onClick={() => navigate('/events/add')}>
                Create an Event
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
