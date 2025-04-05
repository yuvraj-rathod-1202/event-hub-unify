import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNotifications } from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { Bell, ArrowLeft } from "lucide-react";
import { formatDistanceToNow, isDate } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getNotificationsForUser } from "../services/notificationService";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const notificationsData = await getNotificationsForUser(currentUser.uid);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
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
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Notifications
            </h1>

            {notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-800 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.timestamp &&
                          notification.timestamp.toDate
                            ? formatDistanceToNow(
                                notification.timestamp.toDate(),
                                { addSuffix: true }
                              )
                            : notification.timestamp &&
                              isDate(notification.timestamp)
                            ? formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })
                            : notification.timestamp
                            ? "Invalid Date"
                            : "No Date"}
                        </p>
                      </div>
                      {notification.link && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={notification.link}>View</Link>
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You have no notifications.</p>
              </div>
            )}

            <div className="mt-6 text-primary">
              <Button asChild variant="outline">
                <Link to="/send-notification">Send Notification to User</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
