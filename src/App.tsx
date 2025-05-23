
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Firebase Auth Provider
import AuthProvider from "./context/AuthContext";
import NotificationProvider from "./context/NotificationContext";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import OfflineIndicator from "./components/common/OfflineIndicator";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import UpcomingEvents from "./pages/UpcomingEvents";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import CreateClub from "./pages/CreateClub";
import FeaturedClubs from "./pages/FeaturedClubs";
import Notices from "./pages/Notices";
import LatestNotices from "./pages/LatestNotices";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CreateNotice from "./pages/CreateNotice";
import NoticeDetails from "./pages/NoticeDetail";
import EditClub from "./pages/EditClub";
import EditNotice from "./pages/EditNotices";
import EditEvent from "./pages/EditEvent";
import Notifications from "./pages/Notifications";
import SendNotification from "./pages/SendNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Event Routes */}
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:eventId" element={<EventDetails />} />
                  <Route path="/events/add" element={<AddEvent />} />
                  <Route path="/upcoming-events" element={<UpcomingEvents />} />
                  
                  {/* Club Routes */}
                  <Route path="/clubs" element={<Clubs />} />
                  <Route path="/clubs/:clubId" element={<ClubDetail />} />
                  <Route path="/clubs/add" element={<CreateClub />} />
                  <Route path="/featured-clubs" element={<FeaturedClubs />} />
                  
                  {/* Notice Routes */}
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/latest-notices" element={<LatestNotices />} />
                  <Route path="/notices/add" element={<CreateNotice />} />
                  <Route path="/notices/:noticeId" element={<NoticeDetails />} />

                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/send-notification" element={<SendNotification />} />
                  
                  {/* User Dashboard */}
                  <Route path="/dashboard" element={<UserDashboard />} />
                  
                  {/* Admin Dashboard */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/clubs/edit/:clubId" element={<EditClub />} />
                  <Route path="/admin/notices/edit/:noticeId" element={<EditNotice />} />
                  <Route path="/admin/events/edit/:eventId" element={<EditEvent />} />
                  
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <OfflineIndicator />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
