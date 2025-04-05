
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllNotices } from '@/services/noticeService';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import NoticeList from '@/components/notices/NoticeList';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const LatestNotices = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      
      try {
        // Try to get cached data first
        const cachedNotices = getCachedData('latestNotices');
        
        if (cachedNotices) {
          console.log('Using cached latest notices data');
          setNotices(cachedNotices);
          setLoading(false);
        }
        
        // Fetch fresh data
        const noticesData = await getAllNotices(null, 10);
        
        setNotices(noticesData);
        
        // Cache data for offline use
        cacheDataForOffline('latestNotices', noticesData);
      } catch (error) {
        console.error('Error fetching latest notices:', error);
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedNotices = getCachedData('latestNotices');
        if (cachedNotices && notices.length === 0) {
          console.log('Using cached latest notices data after error');
          setNotices(cachedNotices);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotices();
  }, []);
  
  const handleNoticeUpdate = async () => {
    // Refetch notices after an update
    try {
      const noticesData = await getAllNotices(null, 10);
      setNotices(noticesData);
      cacheDataForOffline('latestNotices', noticesData);
    } catch (error) {
      console.error('Error refreshing notices:', error);
    }
  };
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Latest Notices</h1>
            <p className="text-gray-600 mt-1">Stay updated with important announcements</p>
          </div>
          
          {currentUser && (
            <Button onClick={() => navigate('/notices/add')} className="mt-4 md:mt-0">
              <Plus className="h-5 w-5 mr-2" />
              Create Notice
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : notices.length > 0 ? (
          <NoticeList notices={notices} onNoticeUpdate={handleNoticeUpdate} />
        ) : (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No notices available</h3>
            <p className="text-gray-600 mb-4">Check back later for important notices.</p>
            {currentUser && (
              <Button onClick={() => navigate('/notices/add')}>
                Create a Notice
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNotices;
