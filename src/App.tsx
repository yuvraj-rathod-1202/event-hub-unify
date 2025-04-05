
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
import FeaturedClubs from "./pages/FeaturedClubs";
import Notices from "./pages/Notices";
import LatestNotices from "./pages/LatestNotices";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

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
                  <Route path="/featured-clubs" element={<FeaturedClubs />} />
                  
                  {/* Notice Routes */}
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/latest-notices" element={<LatestNotices />} />
                  
                  {/* User Dashboard */}
                  <Route path="/dashboard" element={<UserDashboard />} />
                  
                  {/* Admin Dashboard */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  
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
