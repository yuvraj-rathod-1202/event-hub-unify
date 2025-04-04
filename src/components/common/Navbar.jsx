
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Calendar, User, Home, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin, signInWithGoogle, logOut } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const navLinks = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-5 w-5 mr-2" />
    },
    {
      name: 'Events',
      path: '/events',
      icon: <Calendar className="h-5 w-5 mr-2" />
    },
    {
      name: 'Clubs',
      path: '/clubs',
      icon: <Users className="h-5 w-5 mr-2" />
    },
    {
      name: 'Notices',
      path: '/notices',
      icon: <BookOpen className="h-5 w-5 mr-2" />
    }
  ];
  
  // Add admin link if user is admin
  if (currentUser && isAdmin()) {
    navLinks.push({
      name: 'Admin',
      path: '/admin',
      icon: <User className="h-5 w-5 mr-2" />
    });
  }
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-primary font-bold text-xl">EventHub</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full",
                    location.pathname === link.path
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="flex items-center">
                <Link to="/notifications" className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
                </Link>
                
                <Link to="/dashboard" className="ml-4 flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-full w-full p-1" />
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {currentUser.displayName?.split(' ')[0] || 'User'}
                  </span>
                </Link>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logOut}
                  className="ml-4"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithGoogle}>
                Sign In
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center pl-3 pr-4 py-2 text-base font-medium",
                  location.pathname === link.path
                    ? "bg-primary/10 border-l-4 border-primary text-primary"
                    : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                )}
                onClick={closeMenu}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link
                  to="/notifications"
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={closeMenu}
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <button
                  className="w-full flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={() => {
                    logOut();
                    closeMenu();
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="w-full flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => {
                  signInWithGoogle();
                  closeMenu();
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
