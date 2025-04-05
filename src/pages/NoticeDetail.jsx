import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getNoticeById } from '@/services/noticeService'; // Assuming you have a noticeService
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const NoticeDetails = () => {
  const { noticeId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);

      try {
        const noticeData = await getNoticeById(noticeId);
        setNotice(noticeData);
      } catch (error) {
        console.error('Error fetching notice details:', error);
        toast({
          title: "Error",
          description: "Failed to load notice details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

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

  if (!notice) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notice Not Found</h1>
          <p className="text-gray-600 mb-8">The notice you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/notices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notices
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
            <Link to="/notices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notices
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {notice.category && (
                <span className={`category-badge ${notice.category.toLowerCase()}-badge`}>
                  {notice.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                {notice.deadline && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Deadline: {format(notice.deadline.toDate(), 'PPP')}</span>
                  </div>
                )}

                {notice.club && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Club:</span>
                    <span className="ml-2">{notice.club}</span>
                  </div>
                )}
                {notice.position && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Position:</span>
                    <span className="ml-2">{notice.position}</span>
                  </div>
                )}

              </div>
              <div className="space-y-3">
                {notice.username && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium">Posted by:</span>
                    <span className="ml-2">{notice.username}</span>
                  </div>
                )}
                {notice.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{notice.location}</span>
                  </div>
                )}
              </div>
            </div>

            {notice.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {notice.description}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {currentUser && isAdmin() && (
                <Button variant="outline" asChild>
                  <Link to={`/admin/notices/edit/${noticeId}`}>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Notice
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

export default NoticeDetails;