import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ClubCard = ({ club, onJoin, onLeave, isMember, onSave, isSaved, coordinatorName }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getClubImage = () => {
    return club.logoUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800';
  };

  const getCategoryBadgeClass = (category) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return 'technical-badge';
      case 'cultural':
        return 'cultural-badge';
      case 'sports':
        return 'sports-badge';
      case 'academic':
        return 'academic-badge';
      default:
        return 'general-badge';
    }
  };

  return (
    <div
      className="club-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/clubs/${club.id}`}>
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={getClubImage()}
            alt={club.name}
            className={cn(
              "object-cover w-full h-48 transition-transform duration-300",
              isHovered && "scale-105"
            )}
          />
        </div>
      </Link>

      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(club.id);
          }}
          className={cn(
            "p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors",
            isSaved ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={cn("category-badge inline-block mb-2", getCategoryBadgeClass(club.category))}>
              {club.category}
            </span>
          </div>
        </div>

        <Link to={`/clubs/${club.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {club.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {club.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{club.members?.length || 0} members</span>
          </div>
        </div>

        {coordinatorName && (
          <p className="text-gray-600 text-sm mb-2">
            Coordinator: {coordinatorName}
          </p>
        )}

        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isMember) {
              onLeave(club.id);
            } else {
              onJoin(club.id);
            }
          }}
          className="w-full"
          variant={isMember ? "outline" : "default"}
        >
          {isMember ? "Leave Club" : "Join Club"}
        </Button>
      </div>
    </div>
  );
};

export default ClubCard;