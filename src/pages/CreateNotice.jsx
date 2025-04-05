import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createNotice } from '@/services/noticeService'; // Assuming you have a noticeService
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import NoticeForm from '@/components/notices/NoticeForm'; // Create a NoticeForm component
import RequireAuth from '@/components/common/RequireAuth';

const CreateNotice = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateNotice = async (noticeData) => {
    setLoading(true);

    try {
      const newNotice = await createNotice({
        ...noticeData,
        username: currentUser.displayName, // Include username
      });

      toast({
        title: "Notice created",
        description: `${noticeData.title} has been successfully created.`,
      });

      // Navigate to the notice page or list
      navigate(`/notices`); // Or navigate to a specific notice page: `/notices/${newNotice.id}`
    } catch (error) {
      console.error('Error creating notice:', error);

      toast({
        title: "Error",
        description: error.message || "Failed to create notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Notice</h1>
              <p className="text-gray-600 mt-1">Create a new notice for the community.</p>
            </div>

            <NoticeForm onSubmit={handleCreateNotice} isLoading={loading} />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default CreateNotice;