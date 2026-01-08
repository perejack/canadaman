import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InterviewBooking from './InterviewBooking';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  MessageSquare,
  Phone,
  Video,
  Users,
  Award,
  Heart,
  Zap,
  Sparkles
} from 'lucide-react';

interface MessagingInboxProps {
  onBack: () => void;
  user: any;
}

const MessagingInbox: React.FC<MessagingInboxProps> = ({ onBack, user }) => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const messages = [
    {
      id: 1,
      company: 'Tim Hortons',
      logo: '/images/companies/tim-hortons.jpg',
      subject: 'Congratulations! Interview Invitation for Chef Position',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high',
      content: `Dear ${user.fullName},

🎉 **CONGRATULATIONS!** 🎉

We are absolutely thrilled to inform you that after carefully reviewing your application for the **Chef position**, we have been thoroughly impressed by your qualifications, experience, and passion for culinary excellence.

**Why We Want YOU:**
✨ Your culinary background perfectly matches our requirements
🏆 Your experience demonstrates the skills we're looking for
💫 Your passion for food service aligns with our company values
🇨🇦 Your commitment to building a career in Canada is inspiring

**What This Means for You:**
🚀 **Immediate Interview Opportunity** - We want to meet you ASAP!
💰 **Competitive Salary Package** - $52,000 - $68,000 CAD annually
🏥 **Full Benefits Package** - Health, dental, and immigration support
📈 **Career Growth Path** - From Chef to Kitchen Manager opportunities
🏠 **Relocation Assistance** - We'll help you settle in Canada

**Next Steps:**
We would like to invite you to participate in our interview process. This is your gateway to an amazing career in Canada's most beloved coffee and food chain!

**Interview Details:**
📅 **Available Dates:** January 15-17, 2024
⏰ **Duration:** 45 minutes
💻 **Format:** Video interview (we'll send the link)
🎯 **Focus:** Your culinary skills, experience, and career goals

**What to Expect:**
Our interview will be friendly and conversational. We want to get to know YOU - your passion for cooking, your career aspirations, and how you see yourself growing with Tim Hortons.

**Why Tim Hortons?**
🍁 Canada's #1 coffee and food chain
🌟 Over 4,000 locations across Canada
👥 Amazing team culture and work environment
📚 Comprehensive training and development programs
🎯 Clear path to permanent residency and citizenship

**Ready to Start Your Canadian Dream?**
Click the "Book Interview" button below to schedule your interview at your convenience. Our hiring team is excited to meet you!

**Important:** This opportunity is time-sensitive. We have multiple qualified candidates, so please book your interview within the next 48 hours to secure your spot.

We believe you have incredible potential, and we can't wait to welcome you to the Tim Hortons family!

Warmest regards,

**Sarah Mitchell**  
Senior Hiring Manager  
Tim Hortons Canada  
📧 sarah.mitchell@timhortons.ca  
📱 +1 (416) 555-0123

*P.S. - We're so confident you'll love working with us that we're already preparing your welcome package! 🎁*`,
      interviewSlots: [
        { date: '2024-01-15', time: '10:00 AM', available: true },
        { date: '2024-01-15', time: '2:00 PM', available: true },
        { date: '2024-01-16', time: '11:00 AM', available: false },
        { date: '2024-01-16', time: '3:00 PM', available: true },
        { date: '2024-01-17', time: '9:00 AM', available: true }
      ]
    },
    {
      id: 2,
      company: 'Marriott Hotels',
      logo: '/images/companies/marriott.jpg',
      subject: 'Exciting Opportunity - Executive Chef Position Available',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high',
      content: `Dear ${user.fullName},

🌟 **EXCEPTIONAL OPPORTUNITY AWAITS!** 🌟

Greetings from Marriott Hotels Canada! We hope this message finds you well and excited about your career prospects in beautiful Canada.

**We Have AMAZING News for You!**

After a comprehensive review of your application for the **Executive Chef position**, our culinary team and hiring committee are **unanimously impressed** with your background and potential.

**What Makes You Special:**
🎯 **Perfect Skill Match** - Your culinary expertise aligns perfectly with our standards
🏆 **Outstanding Experience** - Your background shows exactly what we're looking for
💎 **Cultural Fit** - Your values match our commitment to excellence
🌍 **International Perspective** - Your diverse background brings fresh ideas

**This Role Offers You:**
💰 **Premium Compensation** - $65,000 - $85,000 CAD + performance bonuses
🏨 **Luxury Work Environment** - Work in Canada's finest hotels
👑 **Leadership Opportunity** - Lead a team of 15+ culinary professionals
🎓 **Professional Development** - Access to Marriott's global training programs
🇨🇦 **Immigration Pathway** - Full support for permanent residency
🏠 **Relocation Package** - $5,000 moving allowance + temporary accommodation

**Why This is Your Dream Job:**
✨ **Marriott International** - World's leading hospitality company
🏆 **Award-Winning Properties** - Work in 5-star luxury hotels
🌟 **Career Advancement** - Clear path to Regional Executive Chef
🎯 **Creative Freedom** - Design menus and lead culinary innovation
👥 **Amazing Team** - Work with passionate hospitality professionals

**Interview Process:**
We're so excited about your potential that we want to fast-track your interview process!

**Phase 1: Virtual Interview** (45 minutes)
📅 **This Week** - Choose your preferred time slot
💻 **Video Call** - Meet our Executive Chef and HR Director
🎯 **Discussion Topics** - Your culinary philosophy, leadership style, career goals

**Phase 2: Culinary Demonstration** (Optional - for final candidates)
👨‍🍳 **Showcase Your Skills** - Prepare a signature dish
🏨 **On-Site Visit** - Tour our beautiful kitchen facilities
🤝 **Meet the Team** - Connect with your future colleagues

**Exclusive Benefits Package:**
🏥 **Comprehensive Health Coverage** - Medical, dental, vision
💰 **Retirement Savings Plan** - Company matching up to 6%
🏖️ **Generous Vacation** - 3 weeks paid vacation + personal days
🌍 **Travel Discounts** - Up to 50% off Marriott properties worldwide
📚 **Education Support** - Tuition reimbursement for continued learning
🎁 **Employee Recognition** - Quarterly bonuses and awards

**Ready to Join the Marriott Family?**

We believe you have the talent and passion to excel in this role. This is more than just a job - it's your gateway to an extraordinary career in Canada's hospitality industry.

**URGENT:** We're interviewing select candidates this week. To secure your interview slot, please click "Book Interview" below within the next 24 hours.

**What Our Current Chefs Say:**
*"Marriott gave me the opportunity to grow from Chef to Executive Chef in just 2 years. The support for international talent is incredible!"* - Chef Antonio Rodriguez

*"The immigration support was seamless. I'm now a permanent resident and loving my life in Toronto!"* - Chef Priya Patel

We're genuinely excited about the possibility of having you join our culinary team and can't wait to discuss how we can support your Canadian dream!

Best regards,

**Michael Thompson**  
Director of Culinary Operations  
Marriott Hotels Canada  
📧 michael.thompson@marriott.com  
📱 +1 (647) 555-0198

**Jennifer Walsh**  
Senior Talent Acquisition Specialist  
📧 jennifer.walsh@marriott.com

*"At Marriott, we don't just hire employees - we welcome family members who share our passion for exceptional hospitality."*`,
      interviewSlots: [
        { date: '2024-01-15', time: '9:00 AM', available: true },
        { date: '2024-01-15', time: '1:00 PM', available: true },
        { date: '2024-01-16', time: '10:00 AM', available: true },
        { date: '2024-01-16', time: '4:00 PM', available: false },
        { date: '2024-01-17', time: '2:00 PM', available: true }
      ]
    }
  ];

  const selectedMsg = messages.find(m => m.id === selectedMessage);

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

  if (selectedMessage && selectedMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-canadian-blue-light/30 via-white to-canadian-red-light/30 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedMessage(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Messages
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Content */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-canadian-red to-canadian-red-deep text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={selectedMsg.logo}
                        alt={selectedMsg.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedMsg.company}</CardTitle>
                      <p className="text-white/90 text-sm">{selectedMsg.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-white/20 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedMsg.time}
                    </Badge>
                    <Badge className="bg-white/20 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      High Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {selectedMsg.content}
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-canadian-red-light rounded-xl border border-canadian-red/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-canadian-red" />
                      <h3 className="font-semibold text-canadian-red">Book Your Interview Now!</h3>
                    </div>
                    <Button className="w-full bg-canadian-red hover:bg-canadian-red-deep text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Schedule Interview - Secure Your Future!
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview Booking Sidebar */}
            <div>
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-canadian-blue to-canadian-blue-deep text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Available Interview Slots
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {selectedMsg.interviewSlots.map((slot, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          slot.available 
                            ? 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-md' 
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{slot.date}</p>
                            <p className="text-xs text-muted-foreground">{slot.time}</p>
                          </div>
                          {slot.available ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <span className="text-xs text-red-600 font-medium">Booked</span>
                          )}
                        </div>
                        {slot.available && (
                          <Button size="sm" className="w-full mt-2 bg-canadian-blue hover:bg-canadian-blue-deep text-white">
                            Select This Slot
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800 text-sm">Limited Time!</span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Only <span className="font-bold">3 slots remaining</span> this week. Book now to secure your interview!
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Video Interview
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Company Highlights */}
              <Card className="shadow-xl mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-canadian-red" />
                    Why Choose {selectedMsg.company}?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>Excellent employee satisfaction (4.8/5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>Prime locations across Canada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-green-500" />
                      <span>Diverse, inclusive workplace</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span>Fast-track to permanent residency</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canadian-blue-light/30 via-white to-canadian-red-light/30 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-canadian-blue to-canadian-blue-deep text-white">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Your Messages
              <Badge className="bg-white/20 text-white animate-pulse">
                {messages.filter(m => !m.isRead).length} New
              </Badge>
            </CardTitle>
            <p className="text-white/90">Companies are excited to connect with you!</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:shadow-md"
                  onClick={() => setSelectedMessage(message.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={message.logo}
                        alt={message.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-foreground">{message.company}</h3>
                        <div className="flex items-center gap-2">
                          {!message.isRead && (
                            <Badge className="bg-canadian-red text-white animate-bounce">
                              New
                            </Badge>
                          )}
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            High Priority
                          </Badge>
                          <span className="text-sm text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{message.subject}</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        We are thrilled to inform you that after carefully reviewing your application for the {user.positionApplied} position...
                      </p>
                      <div className="flex items-center gap-4">
                        <Button 
                          className="bg-canadian-red hover:bg-canadian-red-deep text-white"
                          onClick={() => {
                            setSelectedCompany({
                              company: message.company,
                              position: 'Chef Position',
                              logo: message.logo,
                              salary: '$52,000 - $68,000',
                              location: 'Toronto, ON'
                            });
                            setShowBooking(true);
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Interview
                        </Button>
                        <Button variant="outline">
                          Read Full Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingInbox;
