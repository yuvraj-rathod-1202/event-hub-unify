
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEventsByUserId } from '@/services/eventService';
import { getClubsByUserId } from '@/services/clubService';
import { getSavedNoticesForUser } from '@/services/noticeService';
import { getUserData } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, BookOpen, UserIcon, Bell } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import ClubCard from '@/components/clubs/ClubCard';
import NoticeCard from '@/components/notices/NoticeCard';
import RequireAuth from '@/components/common/RequireAuth';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [clubMemberships, setClubMemberships] = useState([]);
  const [savedNotices, setSavedNotices] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Fetch user data and user's items in parallel
        const [user, events, clubs, notices] = await Promise.all([
          getUserData(currentUser.uid),
          getEventsByUserId(currentUser.uid),
          getClubsByUserId(currentUser.uid),
          getSavedNoticesForUser(currentUser.uid)
        ]);
        
        setUserData(user);
        setRegisteredEvents(events);
        setClubMemberships(clubs);
        setSavedNotices(notices);
      } catch (error) {
        console.error('Error fetching user dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  // Stub functions for event handling
  const handleRegisterEvent = (eventId) => {
    console.log('Register for event:', eventId);
  };
  
  const handleSaveEvent = (eventId) => {
    console.log('Save event:', eventId);
  };
  
  const handleJoinClub = (clubId) => {
    console.log('Join club:', clubId);
  };
  
  const handleSaveClub = (clubId) => {
    console.log('Save club:', clubId);
  };
  
  const handleSaveNotice = (noticeId) => {
    console.log('Save notice:', noticeId);
  };
  
  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-full w-full p-4 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser?.displayName || 'User'}'s Dashboard
                </h1>
                <p className="text-gray-600">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="events" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                My Events
              </TabsTrigger>
              <TabsTrigger value="clubs" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                My Clubs
              </TabsTrigger>
              <TabsTrigger value="notices" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Saved Notices
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
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
              ) : registeredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registeredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRegister={handleRegisterEvent}
                      isRegistered={true}
                      isFull={false}
                      onSave={handleSaveEvent}
                      isSaved={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No registered events</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't registered for any events yet.
                  </p>
                  <Button asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="clubs">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : clubMemberships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubMemberships.map(club => (
                    <ClubCard
                      key={club.id}
                      club={club}
                      onJoin={handleJoinClub}
                      isMember={true}
                      onSave={handleSaveClub}
                      isSaved={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No club memberships</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't joined any clubs yet.
                  </p>
                  <Button asChild>
                    <Link to="/clubs">Browse Clubs</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="notices">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : savedNotices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedNotices.map(notice => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onSave={handleSaveNotice}
                      isSaved={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No saved notices</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't saved any notices yet.
                  </p>
                  <Button asChild>
                    <Link to="/notices">Browse Notices</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Event Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications about events you've registered for</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="event-notifications"
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="event-notifications" className="ml-2 block text-sm text-gray-900">
                        Enable
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Club Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications about clubs you've joined</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="club-notifications"
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="club-notifications" className="ml-2 block text-sm text-gray-900">
                        Enable
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notice Board Updates</h3>
                      <p className="text-sm text-gray-600">Receive notifications about new notices</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notice-notifications"
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notice-notifications" className="ml-2 block text-sm text-gray-900">
                        Enable
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                        Enable
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  );
};

export default UserDashboard;
