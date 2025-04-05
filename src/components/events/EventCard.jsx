
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDisplayDate, formatDisplayTime } from '@/utils/calendarUtils';

const EventCard = ({ event, onRegister, onUnRegister, isRegistered, isFull, onSave, isSaved }) => {
  const [isHovered, setIsHovered] = useState(false);
  console.log("isRegistered", isRegistered);
  console.log("isFull", isFull);

  const getEventImage = () => {
    return event.posterUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800';
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
      className="event-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/events/${event.id}`}>
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={getEventImage()}
            alt={event.title}
            className={cn(
              "object-cover w-full h-56 transition-transform duration-300",
              isHovered && "scale-105"
            )}
          />
        </div>
      </Link>
      
      {/* <div className="absolute top-4 right-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave(event.id);
          }}
          className={cn(
            "p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors",
            isSaved ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>
       */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={cn("category-badge inline-block mb-2", getCategoryBadgeClass(event.category))}>
              {event.category}
            </span>
          </div>
        </div>
        
        <Link to={`/events/${event.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {event.title}
          </h3>
        </Link>
        
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDisplayDate(event.eventDate)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDisplayTime(event.eventDate)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.registeredUsers && (
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.registeredUsers.length} registered</span>
            </div>
          )}
        </div>
        
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRegister(event.id);
          }}
          className="w-full"
          variant={isRegistered ? "outline" : "default"}
          disabled={isFull && !isRegistered}
        >
          {isRegistered ? "Registered" : isFull ? "Event Full" : "Register Now"}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
