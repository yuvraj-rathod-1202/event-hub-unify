
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NoticeCard from './NoticeCard';
import { toast } from '@/components/ui/use-toast';
import { saveNoticeForUser, unsaveNoticeForUser } from '@/services/noticeService';

const NoticeList = ({ notices, onNoticeUpdate }) => {
  const { currentUser } = useAuth();
  const [savedNotices, setSavedNotices] = useState({});
  
  useEffect(() => {
    if (currentUser && notices.length > 0) {
      // Initialize saved status for each notice
      const saved = {};
      
      notices.forEach(notice => {
        // This would normally come from user data in a real app
        saved[notice.id] = false;
      });
      
      setSavedNotices(saved);
    }
  }, [currentUser, notices]);
  
  const handleSaveNotice = async (noticeId) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save notices.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const notice = notices.find(n => n.id === noticeId);
      
      if (!notice) {
        throw new Error('Notice not found');
      }
      
      if (savedNotices[noticeId]) {
        // User already saved this notice, unsave it
        await unsaveNoticeForUser(noticeId, currentUser.uid);
        
        toast({
          title: "Notice removed",
          description: `${notice.title} has been removed from your saved notices.`,
        });
        
        setSavedNotices(prev => ({
          ...prev,
          [noticeId]: false
        }));
      } else {
        // Save the notice
        await saveNoticeForUser(noticeId, currentUser.uid);
        
        toast({
          title: "Notice saved",
          description: `${notice.title} has been saved to your notices.`,
        });
        
        setSavedNotices(prev => ({
          ...prev,
          [noticeId]: true
        }));
      }
      
      if (onNoticeUpdate) {
        onNoticeUpdate();
      }
    } catch (error) {
      console.error('Error saving/unsaving notice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save/unsave the notice. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (notices.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
        <p className="text-gray-600">Check back later for updates.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notices.map(notice => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onSave={handleSaveNotice}
          isSaved={savedNotices[notice.id]}
        />
      ))}
    </div>
  );
};

export default NoticeList;
