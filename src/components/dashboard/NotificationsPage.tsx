import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InterviewBooking from './InterviewBooking';
import { 
  Bell, 
  BellRing, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Eye, 
  Filter, 
  Heart, 
  MapPin, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  X,
  ArrowLeft,
  Sparkles,
  Award,
  Building2,
  DollarSign
} from 'lucide-react';

interface NotificationsPageProps {
  onBack: () => void;
  notifications?: Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    time: string;
    isNew: boolean;
    priority: string;
  }>;
  userPosition?: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack, notifications: propNotifications, userPosition = 'Chef' }) => {
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Function to get company logo using brighter images
  const getCompanyLogo = (companyName: string) => {
    // Use brighter, more visible company images
    const brightImages = [
      '/images/companies/bright-horizons.jpg',
      '/images/companies/marriott.jpg',
      '/images/companies/hilton.jpg',
      '/images/companies/best-western.jpg',
      '/images/companies/four-seasons.jpg',
      '/images/companies/northern-landscapes.jpg'
    ];
    
    // Use company name length to pick an image
    const index = companyName.length % brightImages.length;
    return brightImages[index];
  };
  
  // Use prop notifications if provided, otherwise fallback to default Chef notifications
  const defaultNotifications = [
    {
      id: 1,
      type: 'interview',
      title: 'New Interview Request',
      message: 'Tim Hortons wants to schedule an interview for the Chef position',
      company: 'Tim Hortons',
      logo: '/images/companies/tim-hortons.jpg',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high',
      action: 'Schedule Interview'
    },
    {
      id: 2,
      type: 'job_offer',
      title: 'Job Offer Available',
      message: 'Marriott Hotels has a new Chef position that matches your profile',
      company: 'Marriott Hotels',
      logo: '/images/companies/marriott.jpg',
      time: '15 minutes ago',
      isRead: false,
      priority: 'high',
      salary: '$65,000 - $75,000',
      action: 'View Offer'
    },
    {
      id: 3,
      type: 'profile_view',
      title: 'Profile Viewed',
      message: 'Your profile was viewed by 5 companies today',
      time: '1 hour ago',
      isRead: true,
      priority: 'normal',
      count: 5
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'McDonald\'s Canada sent you a message about your application',
      company: 'McDonald\'s Canada',
      logo: '/images/companies/mcdonalds.jpg',
      time: '2 hours ago',
      isRead: false,
      priority: 'normal',
      action: 'Read Message'
    },
    {
      id: 5,
      type: 'success',
      title: 'Application Success',
      message: 'Your success rate increased to 94% - you\'re in the top 10%!',
      time: '3 hours ago',
      isRead: true,
      priority: 'normal',
      percentage: '94%'
    },
    {
      id: 6,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Don\'t forget your interview with Subway tomorrow at 2:00 PM',
      company: 'Subway',
      logo: '/images/companies/subway.jpg',
      time: '5 hours ago',
      isRead: true,
      priority: 'medium',
      action: 'View Details'
    }
  ];

  // Transform prop notifications to match the expected format
  const transformedNotifications = propNotifications ? propNotifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    company: notif.message.split(' ')[0] || 'Company', // Extract company from message
    logo: getCompanyLogo(notif.message.split(' ')[0] || 'Company'),
    time: notif.time,
    isRead: !notif.isNew,
    priority: notif.priority,
    action: notif.type.includes('interview') ? 'Schedule Interview' : 'View Details',
    salary: 'Competitive', // Add default salary
    count: 1, // Add default count
    percentage: 85 // Add default percentage
  })) : defaultNotifications;

  const [notifications, setNotifications] = useState(transformedNotifications);

  // Update notifications when props change
  useEffect(() => {
    const newTransformedNotifications = propNotifications ? propNotifications.map(notif => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      company: notif.message.split(' ')[0] || 'Company', // Extract company from message
      logo: getCompanyLogo(notif.message.split(' ')[0] || 'Company'),
      time: notif.time,
      isRead: !notif.isNew,
      priority: notif.priority,
      action: notif.type.includes('interview') ? 'Schedule Interview' : 'View Details',
      salary: 'Competitive', // Add default salary
      count: 1, // Add default count
      percentage: 85 // Add default percentage
    })) : defaultNotifications;
    
    setNotifications(newTransformedNotifications);
  }, [propNotifications, userPosition]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview': return Calendar;
      case 'job_offer': return Briefcase;
      case 'message': return MessageSquare;
      case 'profile_view': return Eye;
      case 'success': return TrendingUp;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'interview': return 'from-emerald-500 to-green-600';
        case 'job_offer': return 'from-blue-500 to-indigo-600';
        case 'message': return 'from-purple-500 to-pink-600';
        default: return 'from-red-500 to-orange-600';
      }
    }
    return 'from-gray-400 to-gray-500';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const markAsRead = (id: number) => {
    setSelectedNotification(id);
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // If it's an interview notification, show booking
    if (notification.type === 'interview' && notification.action === 'Schedule Interview') {
      setSelectedCompany({
        company: notification.company,
        position: 'Chef Position',
        logo: notification.logo,
        salary: notification.salary || '$45,000 - $55,000',
        location: 'Toronto, ON'
      });
      setShowBooking(true);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Show interview booking if requested
  if (showBooking && selectedCompany) {
    return (
      <InterviewBooking
        onBack={() => setShowBooking(false)}
        company={selectedCompany.company}
        position={selectedCompany.position || 'Chef Position'}
        logo={selectedCompany.logo}
        salary={selectedCompany.salary}
        location={selectedCompany.location}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-white/50 transition-all duration-300 px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Notifications</h1>
                  <p className="text-xs sm:text-sm text-gray-600 truncate hidden xs:block">Stay updated with your job search</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50 border-blue-200 text-blue-600 px-2 sm:px-3 flex-shrink-0"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Mark All Read</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 min-h-[calc(100vh-200px)]">
          {/* Notifications List */}
          <div className={`lg:col-span-1 space-y-4 ${selectedNotification ? 'hidden lg:block' : 'block'}`}>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'All', icon: Bell },
                { key: 'unread', label: 'Unread', icon: BellRing },
                { key: 'interview', label: 'Interviews', icon: Calendar },
                { key: 'job_offer', label: 'Job Offers', icon: Briefcase },
                { key: 'message', label: 'Messages', icon: MessageSquare },
                { key: 'profile_view', label: 'Profile Views', icon: Eye }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key)}
                  className={`${
                    filter === key 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-white/50 border-white/30'
                  } transition-all duration-300 px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden xs:inline sm:inline">{label}</span>
                  {key === 'unread' && (
                    <Badge className="ml-1 sm:ml-2 bg-red-500 text-white text-xs px-1">
                      {notifications.filter(n => !n.isRead).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[600px] pr-2">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <Card 
                key={notification.id}
                className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] cursor-pointer ${
                  !notification.isRead 
                    ? 'bg-gradient-to-r from-white to-blue-50/50 border-blue-200 shadow-lg' 
                    : 'bg-white/70 hover:bg-white border-gray-200'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Priority Indicator */}
                {notification.priority === 'high' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                )}
                
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type, notification.priority)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Company Logo */}
                    {notification.logo && (
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={notification.logo} 
                          alt={notification.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold text-sm sm:text-base ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'} group-hover:text-blue-600 transition-colors pr-2`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span className="hidden xs:inline">{notification.time}</span>
                          <span className="xs:hidden">{notification.time.split(' ')[0]}</span>
                        </div>
                      </div>
                      
                      <p className={`text-xs sm:text-sm mb-3 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'} line-clamp-2 sm:line-clamp-none`}>
                        {notification.message}
                      </p>

                      {/* Additional Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          {notification.company && (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate max-w-24 sm:max-w-none">{notification.company}</span>
                            </div>
                          )}
                          {notification.salary && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <DollarSign className="w-3 h-3" />
                              <span className="truncate">{notification.salary}</span>
                            </div>
                          )}
                          {notification.count && (
                            <div className="flex items-center gap-1 text-purple-600 font-medium">
                              <Users className="w-3 h-3" />
                              {notification.count} views
                            </div>
                          )}
                          {notification.percentage && (
                            <div className="flex items-center gap-1 text-orange-600 font-medium">
                              <Award className="w-3 h-3" />
                              {notification.percentage}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {notification.action && (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-3 py-1.5 self-start sm:self-auto"
                            onClick={() => {
                              if (notification.action === 'Schedule Interview') {
                                setSelectedCompany({
                                  company: notification.company,
                                  position: 'Chef Position',
                                  logo: notification.logo,
                                  salary: notification.salary || '$45,000 - $55,000',
                                  location: 'Toronto, ON'
                                });
                                setShowBooking(true);
                              }
                            }}
                          >
                            {notification.action}
                            <Sparkles className="w-3 h-3 ml-1 sm:ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            );
          })}

              {/* Empty State */}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications found</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notification Detail View */}
          <div className={`lg:col-span-2 ${selectedNotification ? 'block' : 'hidden lg:block'}`}>
            {selectedNotification ? (
              <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="lg:hidden mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedNotification(null)}
                      className="hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Notifications
                    </Button>
                  </div>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bell className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Notification Details</h3>
                    <p className="text-gray-500">Detailed notification view coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center bg-white/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a notification</h3>
                  <p className="text-gray-500">Choose a notification from the list to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
