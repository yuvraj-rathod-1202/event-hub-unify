
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, BookOpen, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAllEvents, changeEventStatus } from '@/services/eventService';
import { getAllClubs } from '@/services/clubService';
import { getAllNotices } from '@/services/noticeService';
import RequireAdmin from '@/components/common/RequireAdmin';
import { formatDisplayDate } from '@/utils/calendarUtils';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [notices, setNotices] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data for the admin dashboard
        const [eventsData, clubsData, noticesData] = await Promise.all([
          getAllEvents(),
          getAllClubs(),
          getAllNotices()
        ]);
        
        setEvents(eventsData);
        setPendingEvents(eventsData.filter(event => event.status === 'pending'));
        setClubs(clubsData);
        setNotices(noticesData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        toast({
          title: "Error",
          description: `Failed to load dashboard data. Please try again. ${error}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleApproveEvent = async (eventId) => {
    try {
      await changeEventStatus(eventId, 'approved');
      
      toast({
        title: "Success",
        description: "Event has been approved.",
      });
      
      // Update local state
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, status: 'approved' } : event
      ));
    } catch (error) {
      console.error('Error approving event:', error);
      toast({
        title: "Error",
        description: "Failed to approve event. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRejectEvent = async (eventId) => {
    try {
      await changeEventStatus(eventId, 'rejected');
      
      toast({
        title: "Success",
        description: "Event has been rejected.",
      });
      
      // Update local state
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, status: 'rejected' } : event
      ));
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast({
        title: "Error",
        description: "Failed to reject event. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <RequireAdmin>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage events, clubs, and notices</p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button asChild>
                <Link to="/events/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/clubs/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Club
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/notices/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Notice
                </Link>
              </Button>
            </div>
          </div>
          
          {pendingEvents.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
              <div className="flex">
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">
                    Pending Approvals ({pendingEvents.length})
                  </h3>
                  <div className="mt-2 text-yellow-700">
                    <p>You have {pendingEvents.length} events waiting for approval.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="approvals" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="approvals" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                All Events
              </TabsTrigger>
              <TabsTrigger value="clubs" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Clubs
              </TabsTrigger>
              <TabsTrigger value="notices" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Notices
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="approvals">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-20 bg-gray-200 rounded"></div>
                          <div className="h-8 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingEvents.length > 0 ? (
                <div className="space-y-4">
                  {pendingEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-semibold">
                            <Link to={`/events/${event.id}`} className="hover:text-primary">
                              {event.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatDisplayDate(event.eventDate)}
                          </p>
                          <div className="mt-1">
                            <span className={`category-badge ${event.category.toLowerCase()}-badge`}>
                              {event.category}
                            </span>
                            <span className="category-badge bg-yellow-100 text-yellow-800 ml-2">
                              Pending
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveEvent(event.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectEvent(event.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No pending approvals</h3>
                  <p className="text-gray-600">
                    All events have been reviewed. Great job!
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="events">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            <Link to={`/events/${event.id}`} className="hover:text-primary">
                              {event.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatDisplayDate(event.eventDate)}
                          </p>
                          <div className="mt-1">
                            <span className={`category-badge ${event.category.toLowerCase()}-badge`}>
                              {event.category}
                            </span>
                            {event.status === 'pending' && (
                              <span className="category-badge bg-yellow-100 text-yellow-800 ml-2">
                                Pending
                              </span>
                            )}
                            {event.status === 'approved' && (
                              <span className="category-badge bg-green-100 text-green-800 ml-2">
                                Approved
                              </span>
                            )}
                            {event.status === 'rejected' && (
                              <span className="category-badge bg-red-100 text-red-800 ml-2">
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/events/edit/${event.id}`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No events available</h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first event.
                  </p>
                  <Button asChild>
                    <Link to="/admin/events/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="clubs">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : clubs.length > 0 ? (
                <div className="space-y-4">
                  {clubs.map(club => (
                    <div key={club.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            <Link to={`/clubs/${club.id}`} className="hover:text-primary">
                              {club.name}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm">{club.members?.length || 0} members</p>
                          <div className="mt-1">
                            <span className={`category-badge ${club.category.toLowerCase()}-badge`}>
                              {club.category}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/clubs/edit/${club.id}`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No clubs available</h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first club.
                  </p>
                  <Button asChild>
                    <Link to="/admin/clubs/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Club
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="notices">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            <Link to={`/notices/${notice.id}`} className="hover:text-primary">
                              {notice.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatDisplayDate(notice.createdAt)}
                          </p>
                          <div className="mt-1">
                            <span className={`category-badge ${notice.category.toLowerCase()}-badge`}>
                              {notice.category}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/notices/edit/${notice.id}`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No notices available</h3>
                  <p className="text-gray-600 mb-4">
                    Start by creating your first notice.
                  </p>
                  <Button asChild>
                    <Link to="/admin/notices/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Notice
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAdmin>
  );
};

export default AdminDashboard;
