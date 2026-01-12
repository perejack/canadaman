import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import InterviewBooking from './InterviewBooking';
import { 
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Reply,
  Search,
  Send,
  Sparkles,
  Star,
  Video,
  CheckCircle2,
  Archive,
  Trash2,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';

interface MessagesPageProps {
  onBack: () => void;
  messages?: Array<{
    id: number;
    company: string;
    position: string;
    message: string;
    time: string;
    isNew: boolean;
    avatar: string;
  }>;
  userPosition?: string;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onBack, messages: propMessages, userPosition = 'Chef' }) => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [showBooking, setShowBooking] = useState(false);

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

  // Use prop messages if provided, otherwise fallback to default Chef messages
  const defaultMessages = [
    {
      id: 1,
      company: 'Tim Hortons',
      logo: '/images/companies/tim-hortons.jpg',
      subject: 'Congratulations! Interview Invitation for Chef Position',
      preview: 'We are thrilled to inform you that after carefully reviewing your application...',
      fullMessage: `Dear Frank,

We are thrilled to inform you that after carefully reviewing your application and qualifications, we would like to invite you for an interview for the Chef position at our downtown Toronto location.

Your experience and passion for culinary arts have impressed our hiring team, and we believe you would be a perfect fit for our kitchen team.

Interview Details:
📅 Date: Tomorrow, March 21st, 2024
⏰ Time: 2:00 PM - 3:00 PM
📍 Location: 123 Queen Street West, Toronto
👥 Interview Panel: Head Chef Maria Rodriguez & Store Manager John Smith

Please confirm your attendance by replying to this message. We're excited to meet you in person!

Best regards,
Maria Rodriguez
Head Chef, Tim Hortons Downtown`,
      time: '2 minutes ago',
      isRead: false,
      hasInterview: true,
      priority: 'high',
      salary: '$45,000 - $55,000',
      location: 'Toronto, ON',
      type: 'interview'
    },
    {
      id: 2,
      company: 'Marriott Hotels',
      logo: '/images/companies/marriott.jpg',
      subject: 'Exciting Opportunity - Executive Chef Position',
      preview: 'We have reviewed your qualifications and believe you would be perfect...',
      fullMessage: `Hello Frank,

We have reviewed your qualifications and believe you would be perfect for our Executive Chef position at Marriott Hotel Toronto.

This is an exceptional opportunity to lead our culinary team in a 5-star hotel environment. We offer competitive compensation, comprehensive benefits, and opportunities for career advancement.

Position Highlights:
💰 Salary: $75,000 - $85,000 annually
🏨 Location: Marriott Hotel, Downtown Toronto
👥 Team: Lead a team of 15+ culinary professionals
📈 Growth: Clear path to Regional Chef positions

Benefits Package:
• Extended health and dental coverage
• 3 weeks paid vacation (increasing with tenure)
• Professional development budget ($2,000/year)
• Hotel discounts worldwide
• Retirement savings plan with company matching

We would love to schedule a call to discuss this opportunity further. Are you available for a brief conversation this week?

Looking forward to hearing from you!

Best regards,
Sarah Chen
Director of Human Resources
Marriott Hotels Canada`,
      time: '15 minutes ago',
      isRead: false,
      hasInterview: false,
      priority: 'high',
      salary: '$75,000 - $85,000',
      location: 'Toronto, ON',
      type: 'job_offer'
    },
    {
      id: 3,
      company: 'McDonald\'s Canada',
      logo: '/images/companies/mcdonalds.jpg',
      subject: 'Thank you for your application - Next Steps',
      preview: 'Thank you for applying to the Kitchen Manager position...',
      fullMessage: `Hi Frank,

Thank you for applying to the Kitchen Manager position at our Mississauga location. We appreciate your interest in joining the McDonald's Canada family.

Your application is currently under review by our hiring team. We were impressed by your culinary background and leadership experience.

Next Steps:
1. Application review (completed ✓)
2. Phone screening (scheduled for next week)
3. In-person interview
4. Reference check
5. Job offer

We will contact you within the next 3-5 business days to schedule your phone screening interview.

In the meantime, feel free to learn more about our company culture and benefits on our careers page.

Thank you for your patience, and we look forward to speaking with you soon!

Best regards,
Mike Thompson
Hiring Manager
McDonald's Canada`,
      time: '2 hours ago',
      isRead: true,
      hasInterview: false,
      priority: 'medium',
      salary: '$50,000 - $60,000',
      location: 'Mississauga, ON',
      type: 'application_update'
    },
    {
      id: 4,
      company: 'Subway',
      logo: '/images/companies/subway.jpg',
      subject: 'Interview Reminder - Tomorrow at 2:00 PM',
      preview: 'This is a friendly reminder about your upcoming interview...',
      fullMessage: `Dear Frank,

This is a friendly reminder about your upcoming interview for the Sandwich Artist Supervisor position.

Interview Details:
📅 Tomorrow, March 21st, 2024
⏰ 2:00 PM
📍 Subway - 456 Yonge Street, Toronto
🚇 Nearest TTC: Bloor-Yonge Station

What to bring:
• Two pieces of government-issued ID
• Copies of your resume
• References contact information
• Questions about the role

Parking is available behind the building. Please arrive 10 minutes early to complete any necessary paperwork.

If you need to reschedule or have any questions, please call us at (416) 555-0123.

We're looking forward to meeting you!

Best regards,
Jennifer Walsh
Store Manager
Subway Yonge Street`,
      time: '5 hours ago',
      isRead: true,
      hasInterview: true,
      priority: 'high',
      salary: '$35,000 - $42,000',
      location: 'Toronto, ON',
      type: 'reminder'
    }
  ];

  // Transform prop messages to match the expected format
  const transformedMessages = propMessages ? propMessages.map(msg => ({
    id: msg.id,
    company: msg.company,
    logo: getCompanyLogo(msg.company),
    subject: `Interview Invitation for ${msg.position}`,
    preview: msg.message.substring(0, 100) + '...',
    fullMessage: `Dear Candidate,

${msg.message}

We are excited about the possibility of you joining our team as a ${msg.position}. This is a great opportunity to advance your career in Canada.

Interview Details:
• Position: ${msg.position}
• Company: ${msg.company}
• Location: Canada
• Duration: 30-45 minutes

What to bring:
• Two pieces of government-issued ID
• Copies of your resume
• References contact information
• Questions about the role

We look forward to meeting you!

Best regards,
HR Team
${msg.company}`,
    time: msg.time,
    isRead: !msg.isNew,
    hasInterview: true,
    priority: msg.isNew ? 'high' : 'normal',
    salary: 'Competitive',
    location: 'Canada',
    type: 'interview'
  })) : defaultMessages;

  const [messages, setMessages] = useState(transformedMessages);

  // Update messages when props change
  useEffect(() => {
    const newTransformedMessages = propMessages ? propMessages.map(msg => ({
      id: msg.id,
      company: msg.company,
      logo: getCompanyLogo(msg.company),
      subject: `Interview Invitation for ${msg.position}`,
      preview: msg.message.substring(0, 100) + '...',
      fullMessage: `Dear Candidate,

${msg.message}

We are excited about the possibility of you joining our team as a ${msg.position}. This is a great opportunity to advance your career in Canada.

Interview Details:
• Position: ${msg.position}
• Company: ${msg.company}
• Location: Canada
• Duration: 30-45 minutes

What to bring:
• Two pieces of government-issued ID
• Copies of your resume
• References contact information
• Questions about the role

We look forward to meeting you!

Best regards,
HR Team
${msg.company}`,
      time: msg.time,
      isRead: !msg.isNew,
      hasInterview: true,
      priority: msg.isNew ? 'high' : 'normal',
      salary: 'Competitive',
      location: 'Canada',
      type: 'interview'
    })) : defaultMessages;
    
    setMessages(newTransformedMessages);
  }, [propMessages, userPosition]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return !message.isRead && matchesSearch;
    if (filter === 'interviews') return message.hasInterview && matchesSearch;
    return matchesSearch;
  });

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'interview': return 'from-emerald-500 to-green-600';
      case 'job_offer': return 'from-blue-500 to-indigo-600';
      case 'application_update': return 'from-purple-500 to-pink-600';
      case 'reminder': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // Handle reply logic here
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  const handleMessageClick = (messageId: number) => {
    setSelectedMessage(messageId);
    // Mark message as read when clicked
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, isRead: true }
          : message
      )
    );
  };

  const handleBookInterview = () => {
    setShowBooking(true);
  };

  const handleAcceptInterview = () => {
    if (selectedMessageData) {
      // Show confirmation and then open booking
      alert(`🎉 Interview Accepted!\n\nCompany: ${selectedMessageData.company}\n\nYou've accepted the interview invitation. Let's schedule the details!`);
      setShowBooking(true);
    }
  };

  const handleReschedule = () => {
    if (selectedMessageData) {
      alert(`📅 Reschedule Request\n\nCompany: ${selectedMessageData.company}\n\nLet's find a new time that works for both of you!`);
      setShowBooking(true);
    }
  };

  // Show interview booking if requested
  if (showBooking && selectedMessageData) {
    return (
      <InterviewBooking
        onBack={() => setShowBooking(false)}
        company={selectedMessageData.company}
        position="Chef Position" // You can extract this from the message subject
        logo={selectedMessageData.logo}
        salary={selectedMessageData.salary}
        location={selectedMessageData.location}
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
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {messages.filter(m => !m.isRead).length}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Messages</h1>
                  <p className="text-xs sm:text-sm text-gray-600 truncate hidden xs:block">Connect with potential employers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 min-h-[calc(100vh-200px)]">
          {/* Messages List */}
          <div className={`lg:col-span-1 space-y-4 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-white/30 focus:bg-white"
                />
              </div>
              
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'interviews', label: 'Interviews' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(key)}
                    className={`${
                      filter === key 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                        : 'hover:bg-white/50 border-white/30'
                    } transition-all duration-300 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap flex-shrink-0`}
                  >
                    {label}
                    {key === 'unread' && (
                      <Badge className="ml-1 sm:ml-2 bg-red-500 text-white text-xs px-1">
                        {messages.filter(m => !m.isRead).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
              {filteredMessages.map((message) => (
                <Card 
                  key={message.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    selectedMessage === message.id 
                      ? 'ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50' 
                      : !message.isRead 
                        ? 'bg-gradient-to-r from-white to-blue-50/50 border-blue-200' 
                        : 'bg-white/70 hover:bg-white'
                  }`}
                  onClick={() => handleMessageClick(message.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Company Logo */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={message.logo} 
                            alt={message.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {message.priority === 'high' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-semibold text-sm truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.company}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {message.time}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-2 truncate ${!message.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>
                        
                        <p className="text-xs text-gray-500 truncate mb-2">
                          {message.preview}
                        </p>

                        {/* Message Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {message.hasInterview && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Interview
                            </Badge>
                          )}
                          {message.salary && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {message.salary.split(' - ')[0]}+
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className={`lg:col-span-2 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
            {selectedMessageData ? (
              <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-xl">
                {/* Message Header */}
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                  {/* Mobile Back Button */}
                  <div className="lg:hidden mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedMessage(null)}
                      className="hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Messages
                    </Button>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                        <img 
                          src={selectedMessageData.logo} 
                          alt={selectedMessageData.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg sm:text-xl text-gray-900 mb-1 truncate">
                          {selectedMessageData.company}
                        </CardTitle>
                        <p className="text-gray-600 font-medium mb-2 text-sm sm:text-base line-clamp-2">
                          {selectedMessageData.subject}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{selectedMessageData.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate">{selectedMessageData.location}</span>
                          </div>
                          {selectedMessageData.salary && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">{selectedMessageData.salary}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Message Content */}
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedMessageData.fullMessage}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedMessageData.hasInterview && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Interview Invitation
                      </h4>
                      <div className="flex gap-3">
                        <Button 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                          onClick={handleAcceptInterview}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept Interview
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          onClick={handleReschedule}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Book Interview Button - Always shown at the end of message */}
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          Ready to Take the Next Step?
                        </h4>
                        <p className="text-blue-700 text-xs sm:text-sm">
                          Book an interview with {selectedMessageData.company} and showcase your skills!
                        </p>
                      </div>
                      <Button 
                        onClick={handleBookInterview}
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Interview
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-blue-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Available 24/7
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Instant Confirmation
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        95% Success Rate
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Reply Section */}
                <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">F</span>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <Input
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="pr-20 bg-white border-gray-300 focus:border-purple-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Smile className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Video Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Call
                          </Button>
                        </div>
                        <Button 
                          onClick={handleReply}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                          disabled={!replyText.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center bg-white/50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-12 h-12 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a message</h3>
                  <p className="text-gray-500">Choose a message from the list to view its content</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
