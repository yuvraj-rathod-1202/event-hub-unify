import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { updateNotice, getNoticeById } from '@/services/noticeService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import NoticeForm from '@/components/notices/NoticeForm';
import RequireAuth from '@/components/common/RequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, ArrowLeft } from 'lucide-react';

const EditNotice = () => {
  const { noticeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const noticeData = await getNoticeById(noticeId);
        if (!noticeData) {
          setError('Notice not found.');
        } else {
          setNotice(noticeData);
        }
      } catch (err) {
        console.error('Error fetching notice:', err);
        setError(err.message || 'Failed to fetch notice.');
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const handleUpdateNotice = async (noticeData) => {
    setLoading(true);

    try {
      await updateNotice(noticeId, {
        ...noticeData,
        username: currentUser.displayName, // Include username
      });

      toast({
        title: "Notice updated",
        description: `${noticeData.title} has been successfully updated.`,
      });

      navigate(`/notices/${noticeId}`); // Navigate to the updated notice
    } catch (error) {
      console.error('Error updating notice:', error);

      toast({
        title: "Error",
        description: error.message || "Failed to update notice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-16">
            <Info className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Notice</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Notice</h1>
              <p className="text-gray-600 mt-1">Edit the details of your notice.</p>
            </div>

            <NoticeForm onSubmit={handleUpdateNotice} isLoading={loading} notice={notice} isupdate={true}/>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default EditNotice;