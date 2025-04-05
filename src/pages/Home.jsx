import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getAllEvents } from '@/services/eventService';
import { getAllClubs } from '@/services/clubService';
import { getAllNotices } from '@/services/noticeService';
import { Calendar, Users, Bell, Search, ArrowRight } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import ClubCard from '@/components/clubs/ClubCard';
import NoticeCard from '@/components/notices/NoticeCard';
import InstallPrompt from '@/components/common/InstallPrompt';
import { registerServiceWorker } from '@/utils/pwaUtils';
import { CompareRef } from '../services/userService';
import { joinClub, leaveClub } from '../services/clubService';


const Home = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await registerServiceWorker();
        
        const [eventsData, clubsData, noticesData] = await Promise.all([
          getAllEvents(null, 3),
          getAllClubs(null, 3),
          getAllNotices(null, 3)
        ]);
        
        setEvents(eventsData);
        setClubs(clubsData);
        setNotices(noticesData);
        setFilteredEvents(eventsData);
        setFilteredClubs(clubsData);
        setFilteredNotices(noticesData);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleRegisterEvent = (eventId) => {
    console.log('Register for event:', eventId);
  };
  
  const handleSaveEvent = (eventId) => {
    console.log('Save event:', eventId);
  };
  
  const handleJoinClub = (clubId) => {
    joinClub(clubId, currentUser.uid)
      .then(() => {
        console.log('Joined club:', clubId);
      })
      .catch((error) => {
        console.error('Error joining club:', error);
      });
  };

  const handleLeaveClub = (clubId) => {
    leaveClub(clubId, currentUser.uid)
      .then(() => {
        console.log('Left club:', clubId);
        
      })
      .catch((error) => {
        console.error('Error leaving club:', error);
      });
  };
  
  const handleSaveClub = (clubId) => {
    console.log('Save club:', clubId);
  };
  
  const handleSaveNotice = (noticeId) => {
    console.log('Save notice:', noticeId);
  };

  const handleSearch = () => {
    const filteredEvents = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredClubs = clubs.filter((club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredNotices = notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredEvents(filteredEvents);
    setFilteredClubs(filteredClubs);
    setFilteredNotices(filteredNotices);
  }
  
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/90 to-primary/70 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Discover & Join Campus Events
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Your unified platform for campus events, club management, and important notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary p-2 hover:bg-gray-100"
              >
                <Link to="/events">Explore Events</Link>
              </Button>
              {!currentUser && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <InstallPrompt />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm">
            <div className="flex-1 flex items-center">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search events, clubs or notices..."
                className="flex-1 p-2 focus:outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
            <Button className="ml-2" onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </section>
      
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <p className="text-gray-600 mt-1">Don't miss out on the latest happenings</p>
            </div>
            <Button asChild variant="outline" className="group">
              <Link to="/upcoming-events" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          ) : (
            filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={handleRegisterEvent}
                    isRegistered={CompareRef(event.registeredUsers, currentUser?.uid)}
                    isFull={false}
                    onSave={handleSaveEvent}
                    isSaved={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-600 mb-4">Check back later for new events.</p>
                {currentUser && (
                  <Button asChild>
                    <Link to="/events/add">Create an Event</Link>
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      </section>
      
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Clubs</h2>
              <p className="text-gray-600 mt-1">Discover and join active campus clubs</p>
            </div>
            <Button asChild variant="outline" className="group">
              <Link to="/featured-clubs" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          ) : (
            filteredClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredClubs.map(club => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onJoin={handleJoinClub}
                    isMember={club.members.includes(currentUser?.uid)}
                    onSave={handleSaveClub}
                    onLeave={handleLeaveClub}
                    isSaved={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs available</h3>
                <p className="text-gray-600 mb-4">Check back later for clubs to join.</p>
                {currentUser && (
                  <Button asChild>
                    <Link to="/clubs/add">Create a Club</Link>
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      </section>
      
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Notices</h2>
              <p className="text-gray-600 mt-1">Stay updated with important announcements</p>
            </div>
            <Button asChild variant="outline" className="group">
              <Link to="/latest-notices" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            filteredNotices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredNotices.map(notice => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onSave={handleSaveNotice}
                    isSaved={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notices available</h3>
                <p className="text-gray-600 mb-4">Check back later for important notices.</p>
                {currentUser && (
                  <Button asChild>
                    <Link to="/notices/add">Create a Notice</Link>
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need in One Place</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              EventHub Unify brings together all the tools you need to stay connected with campus life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Management</h3>
              <p className="text-gray-600">
                Find, register, and keep track of all campus events in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Club Directory</h3>
              <p className="text-gray-600">
                Discover and join clubs that match your interests and passions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Notice Board</h3>
              <p className="text-gray-600">
                Stay updated with important announcements, even when offline.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
