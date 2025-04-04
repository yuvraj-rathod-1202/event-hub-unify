
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllClubs } from '@/services/clubService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';
import ClubList from '@/components/clubs/ClubList';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const Clubs = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Academic'
  ];
  
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      
      try {
        // Try to get cached data first
        const cachedClubs = getCachedData('clubs');
        
        if (cachedClubs) {
          console.log('Using cached clubs data');
          setClubs(cachedClubs);
          setLoading(false);
        }
        
        // Fetch fresh data
        const category = selectedCategory === 'All' ? null : selectedCategory;
        const clubsData = await getAllClubs(category);
        
        setClubs(clubsData);
        
        // Cache data for offline use
        cacheDataForOffline('clubs', clubsData);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedClubs = getCachedData('clubs');
        if (cachedClubs && clubs.length === 0) {
          console.log('Using cached clubs data after error');
          setClubs(cachedClubs);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubs();
  }, [selectedCategory]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    
    setSearchParams(searchParams);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Simple client-side filtering for now
    console.log('Searching for:', searchTerm);
  };
  
  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
            <p className="text-gray-600 mt-1">Discover and join campus clubs</p>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
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
        ) : filteredClubs.length > 0 ? (
          <ClubList clubs={filteredClubs} />
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory 
                ? `No ${selectedCategory.toLowerCase()} clubs are currently available.` 
                : "No clubs match your search criteria."}
            </p>
            {currentUser && (
              <Button>
                Create a Club
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
