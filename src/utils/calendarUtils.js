
// Calendar Utilities

// Convert event to Google Calendar format
export const convertToGoogleCalendarEvent = (event) => {
  // Format date for Google Calendar
  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const startDate = formatDate(event.eventDate);
  const endDate = formatDate(event.endDate || new Date(new Date(event.eventDate).getTime() + 2 * 60 * 60 * 1000)); // 2 hours later if no end date
  
  // Create Google Calendar URL
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}&sf=true&output=xml`;
  
  return googleCalendarUrl;
};

// Generate ICS (iCal) format
export const generateICS = (event) => {
  // Format date for iCal
  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const startDate = formatDate(event.eventDate);
  const endDate = formatDate(event.endDate || new Date(new Date(event.eventDate).getTime() + 2 * 60 * 60 * 1000)); // 2 hours later if no end date
  
  // Create ICS content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventHub//v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event.id || Math.random().toString(36).substring(2, 15)}
SUMMARY:${event.title || 'Event'}
DTSTAMP:${formatDate(new Date())}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  
  return icsContent;
};

// Download ICS file
export const downloadICS = (event) => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title || 'event'}.ics`;
  
  // Append link to body, click it, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Convert date to display format (e.g., "Mon, Apr 5, 2023")
export const formatDisplayDate = (date) => {
  if (!date) return '';
  
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Convert time to display format (e.g., "2:30 PM")
export const formatDisplayTime = (date) => {
  if (!date) return '';
  
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(date).toLocaleTimeString(undefined, options);
};

// Get date range for current month
export const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return { firstDay, lastDay };
};

// Group events by date
export const groupEventsByDate = (events) => {
  const grouped = {};
  
  events.forEach(event => {
    const eventDate = new Date(event.eventDate);
    const dateString = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    
    grouped[dateString].push(event);
  });
  
  return grouped;
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

// Check if date is in the past
export const isPastDate = (date) => {
  const now = new Date();
  const checkDate = new Date(date);
  
  // Remove time components for fair comparison
  now.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < now;
};
