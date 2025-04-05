import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllUsers } from '@/services/userService'; // Assuming you have these functions
import { sendNotificationToUser } from '@/services/notificationService'; // Assuming you have this function
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SendNotification = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({ title: 'Error', description: 'Failed to load users.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!selectedUserId) {
      toast({ title: 'Warning', description: 'Please select a user.', variant: 'destructive' });
      return;
    }
    if (!message.trim()) {
      toast({ title: 'Warning', description: 'Please enter a message.', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    try {
      await sendNotificationToUser(selectedUserId, message, currentUser.uid);
      toast({ title: 'Success', description: 'Notification sent.' });
      navigate('/notifications');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({ title: 'Error', description: 'Failed to send notification.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Send Notification to User</h1>
          <Select onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.uid} value={user.uid}>
                  {user.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type='text' placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="mb-4" />
          <Button onClick={handleSend} disabled={isSending}>
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;