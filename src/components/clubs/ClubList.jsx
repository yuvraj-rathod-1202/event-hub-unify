
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ClubCard from './ClubCard';
import { toast } from '@/components/ui/use-toast';
import { joinClub, leaveClub } from '@/services/clubService';

const ClubList = ({ clubs, onClubUpdate }) => {
  const { currentUser } = useAuth();
  const [clubMemberships, setClubMemberships] = useState({});
  const [savedClubs, setSavedClubs] = useState({});
  
  useEffect(() => {
    if (currentUser && clubs.length > 0) {
      // Initialize membership status for each club
      const memberships = {};
      const saved = {};
      
      clubs.forEach(club => {
        const isMember = club.members && club.members.includes(currentUser.uid);
        memberships[club.id] = isMember;
        
        // Check if club is saved (this would come from user data in a real app)
        saved[club.id] = false; // Default false, to be updated from user preferences
      });
      
      setClubMemberships(memberships);
      setSavedClubs(saved);
    }
  }, [currentUser, clubs]);
  
  const handleJoinClub = async (clubId) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join clubs.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const club = clubs.find(c => c.id === clubId);
      
      if (!club) {
        throw new Error('Club not found');
      }
      
      if (clubMemberships[clubId]) {
        // User is already a member, remove them
        await leaveClub(clubId, currentUser.uid);
        
        toast({
          title: "Success",
          description: `You have left ${club.name}.`,
        });
        
        setClubMemberships(prev => ({
          ...prev,
          [clubId]: false
        }));
      } else {
        // Join the club
        await joinClub(clubId, currentUser.uid);
        
        toast({
          title: "Success",
          description: `You have joined ${club.name}.`,
        });
        
        setClubMemberships(prev => ({
          ...prev,
          [clubId]: true
        }));
      }
      
      if (onClubUpdate) {
        onClubUpdate();
      }
    } catch (error) {
      console.error('Error joining/leaving club:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join/leave the club. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveClub = (clubId) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save clubs.",
        variant: "destructive"
      });
      return;
    }
    
    // Toggle saved status
    setSavedClubs(prev => {
      const newSavedStatus = {
        ...prev,
        [clubId]: !prev[clubId]
      };
      
      // In a real app, you would update this in user preferences in Firestore
      const club = clubs.find(c => c.id === clubId);
      
      toast({
        title: newSavedStatus[clubId] ? "Club saved" : "Club removed",
        description: newSavedStatus[clubId] 
          ? `${club.name} has been saved to your bookmarks.`
          : `${club.name} has been removed from your bookmarks.`
      });
      
      return newSavedStatus;
    });
  };
  
  if (clubs.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
        <p className="text-gray-600">Check back later for clubs to join.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map(club => (
        <ClubCard
          key={club.id}
          club={club}
          onJoin={handleJoinClub}
          isMember={clubMemberships[club.id]}
          onSave={handleSaveClub}
          isSaved={savedClubs[club.id]}
        />
      ))}
    </div>
  );
};

export default ClubList;
