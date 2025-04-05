import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllNotices } from '@/services/noticeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import NoticeList from '@/components/notices/NoticeList';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const Notices = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const navigate = useNavigate();

  const categories = [
    'All',
    'Academic',
    'Club',
    'Sports',
    'Deadline',
    'General'
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);

      try {
        // Try to get cached data first
        const cachedNotices = getCachedData('notices');

        if (cachedNotices) {
          console.log('Using cached notices data');
          // Apply category filter to cached data
          const filteredCached = selectedCategory === 'All' || !selectedCategory ? cachedNotices : cachedNotices.filter(notice => notice.category === selectedCategory);
          setNotices(filteredCached);
          setLoading(false);
        }

        // Fetch fresh data
        const category = selectedCategory === 'All' ? null : selectedCategory;
        const noticesData = await getAllNotices(category);

        setNotices(noticesData);

        // Cache data for offline use
        cacheDataForOffline('notices', noticesData);
      } catch (error) {
        console.error('Error fetching notices:', error);

        // If we have cached data and an error occurred, we can still use the cached data
        const cachedNotices = getCachedData('notices');
        if (cachedNotices && notices.length === 0) {
          console.log('Using cached notices data after error');
          // Apply category filter to cached data
          const filteredCached = selectedCategory === 'All' || !selectedCategory ? cachedNotices : cachedNotices.filter(notice => notice.category === selectedCategory);
          setNotices(filteredCached);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
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

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notice.content && notice.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Digital Notice Board</h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest announcements</p>
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
                    placeholder="Search notices..."
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
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredNotices.length > 0 ? (
          <NoticeList notices={filteredNotices} />
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory
                ? `No ${selectedCategory.toLowerCase()} notices are currently available.`
                : "No notices match your search criteria."}
            </p>
            {currentUser && (
              <Button onClick={() => navigate('/notices/create')}>
                Create a Notice
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;