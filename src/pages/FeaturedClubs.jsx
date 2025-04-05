
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllClubs } from '@/services/clubService';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import ClubList from '@/components/clubs/ClubList';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const FeaturedClubs = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      
      try {
        // Try to get cached data first
        const cachedClubs = getCachedData('featuredClubs');
        
        if (cachedClubs) {
          console.log('Using cached featured clubs data');
          setClubs(cachedClubs);
          setLoading(false);
        }
        
        // Fetch fresh data
        const clubsData = await getAllClubs(null, 10);
        
        setClubs(clubsData);
        
        // Cache data for offline use
        cacheDataForOffline('featuredClubs', clubsData);
      } catch (error) {
        console.error('Error fetching featured clubs:', error);
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedClubs = getCachedData('featuredClubs');
        if (cachedClubs && clubs.length === 0) {
          console.log('Using cached featured clubs data after error');
          setClubs(cachedClubs);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubs();
  }, []);
  
  const handleClubUpdate = async () => {
    // Refetch clubs after an update
    try {
      const clubsData = await getAllClubs(null, 10);
      setClubs(clubsData);
      cacheDataForOffline('featuredClubs', clubsData);
    } catch (error) {
      console.error('Error refreshing clubs:', error);
    }
  };
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Featured Clubs</h1>
            <p className="text-gray-600 mt-1">Discover and join active campus clubs</p>
          </div>
          
          {currentUser && (
            <Button onClick={() => navigate('/clubs/add')} className="mt-4 md:mt-0">
              <Plus className="h-5 w-5 mr-2" />
              Create Club
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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
        ) : clubs.length > 0 ? (
          <ClubList clubs={clubs} onClubUpdate={handleClubUpdate} />
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No clubs available</h3>
            <p className="text-gray-600 mb-4">Check back later for clubs to join.</p>
            {currentUser && (
              <Button onClick={() => navigate('/clubs/add')}>
                Create a Club
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedClubs;
