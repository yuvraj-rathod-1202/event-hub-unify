
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createClub } from '@/services/clubService';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClubForm from '@/components/clubs/ClubForm';
import RequireAuth from '@/components/common/RequireAuth';

const CreateClub = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleCreateClub = async (clubData, logoFile) => {
    setLoading(true);
    
    try {
      const newClub = await createClub(clubData, logoFile);
      
      toast({
        title: "Club created",
        description: `${clubData.name} has been successfully created.`,
      });
      
      // Navigate to the club page
      navigate(`/clubs/${newClub.id}`);
    } catch (error) {
      console.error('Error creating club:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create club. Please try again.",
        variant: "destructive"
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
              <h1 className="text-3xl font-bold text-gray-900">Create Club</h1>
              <p className="text-gray-600 mt-1">Create a new club for people to join</p>
            </div>
            
            <ClubForm onSubmit={handleCreateClub} isLoading={loading} />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default CreateClub;
