
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bookmark } from 'lucide-react';
import { formatDisplayDate } from '@/utils/calendarUtils';
import { cn } from '@/lib/utils';

const NoticeCard = ({ notice, onSave, isSaved }) => {
  const getCategoryBadgeClass = (category) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return 'academic-badge';
      case 'club':
        return 'cultural-badge';
      case 'sports':
        return 'sports-badge';
      case 'deadline':
        return 'technical-badge';
      default:
        return 'general-badge';
    }
  };
  
  return (
    <div className="notice-card relative">
      <div className="flex justify-between items-start">
        <span className={cn("category-badge", getCategoryBadgeClass(notice.category))}>
          {notice.category}
        </span>
        
        <button
          onClick={() => onSave(notice.id)}
          className={cn(
            "text-gray-400 hover:text-primary transition-colors",
            isSaved && "text-primary"
          )}
          aria-label={isSaved ? "Unsave notice" : "Save notice"}
        >
          <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>
      
      <Link to={`/notices/${notice.id}`}>
        <h3 className="text-lg font-semibold mt-2 mb-1 hover:text-primary transition-colors">
          {notice.title}
        </h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {notice.content}
      </p>
      
      <div className="flex items-center text-gray-500 text-xs">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{formatDisplayDate(notice.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoticeCard;
