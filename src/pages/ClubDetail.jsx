
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getClubById, joinClub, leaveClub } from '@/services/clubService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, MapPin, Info, ArrowLeft } from 'lucide-react';
import { cacheDataForOffline, getCachedData } from '@/utils/pwaUtils';

const ClubDetail = () => {
  const { clubId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [joiningOrLeaving, setJoiningOrLeaving] = useState(false);
  
  useEffect(() => {
    const fetchClubDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get cached data first
        const cachedClub = getCachedData(`club-${clubId}`);
        
        if (cachedClub) {
          console.log('Using cached club data');
          setClub(cachedClub);
          
          if (currentUser) {
            setIsMember(cachedClub.members?.includes(currentUser.uid) || false);
          }
          
          setLoading(false);
        }
        
        // Fetch fresh data
        const clubData = await getClubById(clubId);
        
        setClub(clubData);
        
        if (currentUser) {
          setIsMember(clubData.members?.includes(currentUser.uid) || false);
        }
        
        // Cache data for offline use
        cacheDataForOffline(`club-${clubId}`, clubData);
      } catch (error) {
        console.error('Error fetching club details:', error);
        setError(error.message || 'Failed to load club details');
        
        // If we have cached data and an error occurred, we can still use the cached data
        const cachedClub = getCachedData(`club-${clubId}`);
        if (cachedClub && !club) {
          console.log('Using cached club data after error');
          setClub(cachedClub);
          
          if (currentUser) {
            setIsMember(cachedClub.members?.includes(currentUser.uid) || false);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId, currentUser]);
  
  const handleJoinLeaveClub = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join clubs.",
        variant: "destructive"
      });
      return;
    }
    
    setJoiningOrLeaving(true);
    
    try {
      if (isMember) {
        await leaveClub(clubId, currentUser.uid);
        toast({
          title: "Success",
          description: `You have left ${club.name}.`,
        });
        setIsMember(false);
      } else {
        await joinClub(clubId, currentUser.uid);
        toast({
          title: "Success",
          description: `You have joined ${club.name}.`,
        });
        setIsMember(true);
      }
      
      // Update club data after joining/leaving
      const updatedClub = await getClubById(clubId);
      setClub(updatedClub);
      cacheDataForOffline(`club-${clubId}`, updatedClub);
    } catch (error) {
      console.error('Error joining/leaving club:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join/leave the club. Please try again.",
        variant: "destructive"
      });
    } finally {
      setJoiningOrLeaving(false);
    }
  };
  
  const getClubImage = () => {
    return club?.logoUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800';
  };
  
  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'academic':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <Skeleton className="h-64 w-full rounded-xl mb-6" />
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
  
  if (error && !club) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Info className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Club</h2>
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
  
  if (!club) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Club Not Found</h2>
            <p className="text-gray-600 mb-6">The club you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/clubs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clubs
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/clubs" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clubs
        </Link>
        
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 md:aspect-h-6">
            <img 
              src={getClubImage()} 
              alt={club.name}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryBadgeClass(club.category)}`}>
              {club.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              {club.members?.length || 0} members
            </p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700">{club.description}</p>
          </div>
          
          {club.meetingInfo && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Meeting Information</h3>
                
                {club.meetingLocation && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Location</p>
                      <p className="text-gray-600">{club.meetingLocation}</p>
                    </div>
                  </div>
                )}
                
                {club.meetingSchedule && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Schedule</p>
                      <p className="text-gray-600">{club.meetingSchedule}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="pt-4">
            <Button 
              onClick={handleJoinLeaveClub}
              className="w-full md:w-auto"
              variant={isMember ? "outline" : "default"}
              disabled={joiningOrLeaving}
            >
              {joiningOrLeaving 
                ? (isMember ? "Leaving..." : "Joining...") 
                : (isMember ? "Leave Club" : "Join Club")
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
