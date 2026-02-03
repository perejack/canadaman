import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MessagingInbox from './MessagingInbox';
import NotificationsPage from './NotificationsPage';
import MessagesPage from './MessagesPage';
import InterviewBooking from './InterviewBooking';
import UpgradePackagesModal from './UpgradePackagesModal';
import { getJobSpecificData } from '../../data/jobSpecificData';
import { 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  Calendar, 
  Briefcase, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle, 
  Star, 
  Award, 
  Sparkles, 
  Heart 
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'notifications' | 'messages'>('dashboard');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'basic' | 'premium' | 'platinum'>('basic');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Get job-specific data based on user's position
  const userJobPosition = user?.positionApplied || user?.jobPosition || user?.selectedJob || 'chef'; // Default to chef if no position
  const jobData = getJobSpecificData(userJobPosition);

  // Function to get working company logo using brighter images
  const getWorkingLogo = (companyName: string) => {
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
  
  // Debug log to see what position is being used
  console.log('User job position:', userJobPosition);
  console.log('Job data loaded for:', userJobPosition);
  console.log('Messages count:', jobData.messages.length);
  console.log('Notifications count:', jobData.notifications.length);
  console.log('Sample message:', jobData.messages[0]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle upgrade success
  const handleUpgradeSuccess = (packageType: 'premium' | 'platinum') => {
    setAccountStatus(packageType);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  // Handle apply button click
  const handleApplyClick = () => {
    if (accountStatus === 'basic') {
      setShowUpgradeModal(true);
    } else {
      // Show success message for upgraded accounts
      alert('🎉 Application sent successfully! You will be contacted within 24 hours.');
    }
  };

  const [notifications, setNotifications] = useState(jobData.notifications);

  const [messages] = useState(jobData.messages.map(msg => ({
    ...msg,
    logo: getWorkingLogo(msg.company),
    subject: `Interview Invitation for ${msg.position}`,
    preview: msg.message,
    isRead: false,
    hasInterview: true
  })));

  const [jobOffers] = useState(jobData.companies.map((company, index) => ({
    id: index + 1,
    company: company.name,
    logo: getWorkingLogo(company.name),
    position: company.position,
    salary: company.salary,
    location: company.location,
    type: company.type,
    benefits: company.benefits,
    urgency: 'High Priority'
  })));

  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Simulate new notification popup
    const timer = setTimeout(() => {
      setShowNotificationPopup(true);
      setTimeout(() => setShowNotificationPopup(false), 5000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const unreadNotifications = notifications.filter(n => n.isNew).length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

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
        userId={user?.id}
      />
    );
  }

  // Conditional rendering based on current page
  if (currentPage === 'notifications') {
    return <NotificationsPage 
      onBack={() => setCurrentPage('dashboard')} 
      notifications={jobData.notifications}
      userPosition={userJobPosition}
    />;
  }

  if (currentPage === 'messages') {
    return <MessagesPage 
      onBack={() => setCurrentPage('dashboard')} 
      messages={jobData.messages}
      userPosition={userJobPosition}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canadian-blue-light/30 via-white to-canadian-red-light/30">
      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-500">
          <Card className="w-80 shadow-2xl border-l-4 border-l-canadian-red bg-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-canadian-red-light rounded-full flex items-center justify-center animate-pulse">
                  <Bell className="w-5 h-5 text-canadian-red" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">New Interview Request!</h4>
                  <p className="text-xs text-muted-foreground mt-1">Tim Hortons wants to schedule an interview with you</p>
                  <Button size="sm" className="mt-2 h-6 text-xs bg-canadian-red hover:bg-canadian-red-deep">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                <img 
                  src="/images/canada-flag-logo.jpg" 
                  alt="Canada Flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-foreground truncate">
                  <span className="hidden sm:inline">Canada </span>Jobs Portal
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Welcome back, <span className="hidden xs:inline">{user.fullName}</span>
                  <span className="xs:hidden">{user.username}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Notifications - Mobile Compact */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 sm:p-2.5 hover:bg-red-50 transition-all duration-300"
                onClick={() => setCurrentPage('notifications')}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 p-0 text-xs bg-canadian-red text-white rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* Messages - Mobile Compact */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 sm:p-2.5 hover:bg-blue-50 transition-all duration-300"
                onClick={() => setCurrentPage('messages')}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 p-0 text-xs bg-canadian-blue text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>

              {/* Profile - Hidden on very small screens */}
              <div className="hidden xs:flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-canadian-red-light rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-canadian-red" />
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:block max-w-20 truncate">{user.username}</span>
              </div>

              {/* Logout Button - Responsive */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-canadian-red to-canadian-red-deep text-white shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold mb-2">Welcome back, {user.fullName}! 🎉</h2>
                  <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">
                    Great news! You have <span className="font-bold">{unreadMessages} new interview requests</span> and <span className="font-bold">{jobOffers.length} job offers</span> waiting for you.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">Position: {user.positionApplied}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">From: {user.location}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex-shrink-0 ml-4">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Interview Requests */}
          <div 
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={() => setCurrentPage('messages')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {unreadMessages}
              </div>
              <div className="text-white/90 text-xs sm:text-sm font-medium">Interview Requests</div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Job Offers */}
          <div 
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={() => setCurrentPage('notifications')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {jobOffers.length}
              </div>
              <div className="text-white/90 text-sm font-medium">Job Offers</div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Profile Views */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-white animate-bounce" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                127
              </div>
              <div className="text-white/90 text-sm font-medium">Profile Views</div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-white animate-pulse" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                94%
              </div>
              <div className="text-white/90 text-sm font-medium">Success Rate</div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interview Requests */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-canadian-red" />
                  Interview Requests
                  <Badge className="bg-canadian-red text-white animate-pulse">{unreadMessages}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src={message.logo}
                          alt={message.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{message.company}</h4>
                          <div className="flex items-center gap-2">
                            {!message.isRead && (
                              <Badge className="bg-canadian-red text-white text-xs">New</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                        </div>
                        <h5 className="text-sm font-medium text-foreground mb-1">{message.subject}</h5>
                        <p className="text-sm text-muted-foreground mb-3">{message.preview}</p>
                        <Button 
                          size="sm" 
                          className="bg-canadian-blue hover:bg-canadian-blue-deep text-white"
                          onClick={() => {
                            setSelectedCompany({
                              company: message.company,
                              position: 'Chef Position',
                              logo: message.logo,
                              salary: '$45,000 - $55,000',
                              location: 'Toronto, ON'
                            });
                            setShowBooking(true);
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Job Offers */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-canadian-blue" />
                  Available Job Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobOffers.map((offer) => (
                  <div key={offer.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src={offer.logo}
                          alt={offer.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-foreground">{offer.company}</h4>
                        <p className="text-xs text-muted-foreground">{offer.position}</p>
                      </div>
                      <Badge className={`text-xs ${offer.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {offer.urgency}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="font-medium text-green-700">{offer.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{offer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>{offer.type}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {offer.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {offer.benefits.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{offer.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-canadian-red hover:bg-canadian-red-deep text-white"
                      onClick={handleApplyClick}
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Account upgraded successfully! 🎉</span>
          </div>
        </div>
      )}

      {/* Upgrade Packages Modal */}
      <UpgradePackagesModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        userId={user?.id}
      />
    </div>
  );
};

export default Dashboard;
