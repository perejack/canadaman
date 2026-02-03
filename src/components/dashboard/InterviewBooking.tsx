import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SurveyAd, PopupSurveyAd } from '@/components/ui/survey-ad';
import { useSurveyAds } from '@/hooks/useSurveyAds';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Star,
  Award,
  Briefcase,
  Building2,
  Users,
  Coffee,
  ChefHat,
  Utensils,
  MessageSquare,
  FileText,
  Camera,
  Sparkles,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  X
} from 'lucide-react';

interface InterviewBookingProps {
  onBack: () => void;
  company: string;
  position: string;
  logo: string;
  salary?: string;
  location?: string;
  userId?: string;
}

const InterviewBooking: React.FC<InterviewBookingProps> = ({ 
  onBack, 
  company, 
  position, 
  logo, 
  salary, 
  location,
  userId,
}) => {
  const { popupVisible, currentAdIndex, showPopupAd, hidePopupAd, showAdSequence } = useSurveyAds();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [interviewType, setInterviewType] = useState<'video' | 'phone'>('video');
  const [step, setStep] = useState<'details' | 'schedule' | 'confirmation' | 'verification' | 'payment'>('details');
  const [showReviewAnimation, setShowReviewAnimation] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [paymentStatusInterval, setPaymentStatusInterval] = useState<NodeJS.Timeout | null>(null);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Generate dynamic available dates
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Generate next 4 business days (excluding weekends)
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 4) {
      const dayOfWeek = currentDate.getDay();
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const isToday = currentDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
        
        dates.push({
          date: dateStr,
          day: isToday ? 'Tomorrow' : dayName,
          slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  // STK Push Functions
  const initiateSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      alert("Please enter a valid phone number");
      return;
    }
    
    setIsProcessingPayment(true);
    setPaymentStatus('PENDING');
    
    try {
      let applicationId: string | null = null;
      try {
        const raw = localStorage.getItem('canadaJobsApplicationData');
        if (raw) {
          const parsed = JSON.parse(raw);
          applicationId = typeof parsed?.applicationId === 'string' ? parsed.applicationId : null;
        }
      } catch {
        applicationId = null;
      }

      let interviewAt: string | null = null;
      if (selectedDate && selectedTime) {
        try {
          const [timePart, meridiem] = selectedTime.split(' ');
          const [rawHour, rawMinute] = timePart.split(':');
          let hour = Number.parseInt(rawHour, 10);
          const minute = Number.parseInt(rawMinute, 10);
          const upper = (meridiem || '').toUpperCase();
          if (upper === 'PM' && hour !== 12) hour += 12;
          if (upper === 'AM' && hour === 12) hour = 0;
          const hh = String(hour).padStart(2, '0');
          const mm = String(minute).padStart(2, '0');
          interviewAt = new Date(`${selectedDate}T${hh}:${mm}:00`).toISOString();
        } catch {
          interviewAt = null;
        }
      }

      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `254${phoneNumber}`,
          amount: 250, // Updated amount
          description: 'Account Verification Fee',
          purpose: 'interview_booking',
          applicationId,
          userId: userId || null,
          interviewCompany: company,
          interviewPosition: position,
          interviewType,
          interviewAt,
          interviewStatus: 'pending',
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const requestId = result.data.checkoutRequestId || result.data.externalReference;
        setCheckoutRequestId(requestId);
        
        alert("📱 STK push sent! Please check your phone and enter your M-Pesa PIN.");
        
        // Start polling for payment status
        startPaymentStatusPolling(requestId);
      } else {
        throw new Error(result.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessingPayment(false);
      setPaymentStatus('FAILED');
    }
  };

  const startPaymentStatusPolling = (requestId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment-status?reference=${requestId}`);
        const result = await response.json();
        
        if (result.success && result.payment) {
          const status = result.payment.status;
          setPaymentStatus(status as 'PENDING' | 'SUCCESS' | 'FAILED');
          
          if (status === 'SUCCESS') {
            clearInterval(interval);
            setPaymentStatusInterval(null);
            setIsProcessingPayment(false);
            alert("✅ Payment Successful! Your account has been verified and activated!");
            setStep('confirmation');

            // Show sequence of survey ads on payment success
            showAdSequence([
              { delay: 500, adIndex: 1 },
              { delay: 0, adIndex: 0 }
            ]);

            // Track conversion with Google Analytics for all accounts
            if (typeof window !== 'undefined' && (window as any).gtag) {
              const googleAdsAccounts = [
                'AW-17581166310',
                'AW-17628890920',
                'AW-17620741802'
              ];
              
              googleAdsAccounts.forEach(accountId => {
                (window as any).gtag('event', 'conversion', {
                  send_to: `${accountId}/conversion`,
                  value: 250,
                  currency: 'KES',
                  transaction_id: requestId
                });
              });
              
              console.log('Conversion tracked for all accounts, transaction:', requestId);
            }
          } else if (status === 'FAILED') {
            clearInterval(interval);
            setPaymentStatusInterval(null);
            setIsProcessingPayment(false);
            alert("❌ Payment failed. Please try again.");
            setPaymentStatus('FAILED');
            // Show sequence of survey ads when payment fails
            showAdSequence([
              { delay: 500, adIndex: 3 },
              { delay: 0, adIndex: 4 }
            ]);
          } else if (status === 'CANCELLED') {
            clearInterval(interval);
            setPaymentStatusInterval(null);
            setIsProcessingPayment(false);
            alert("❌ Payment was cancelled. Please try again.");
            setPaymentStatus('FAILED');
            // Show sequence of survey ads when payment is cancelled
            showAdSequence([
              { delay: 300, adIndex: 2 },
              { delay: 0, adIndex: 4 }
            ]);
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 3000); // Check every 3 seconds
    
    setPaymentStatusInterval(interval);
    
    // Stop polling after 2 minutes
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPaymentStatusInterval(null);
        if (paymentStatus === 'PENDING') {
          setIsProcessingPayment(false);
          alert("⏰ Payment timeout. Please try again.");
          setPaymentStatus('FAILED');
          // Show sequence of survey ads when payment times out
          showAdSequence([
            { delay: 500, adIndex: 1 },
            { delay: 0, adIndex: 5 }
          ]);
        }
      }
    }, 120000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  const interviewTypes = [
    {
      type: 'video' as const,
      title: 'Video Interview',
      description: 'Meet via Zoom or Teams',
      icon: Camera,
      duration: '30-45 minutes',
      popular: true
    },
    {
      type: 'phone' as const,
      title: 'Phone Interview',
      description: 'Traditional phone call',
      icon: Phone,
      duration: '20-30 minutes',
      popular: false
    }
  ];

  const handleBooking = async () => {
    if (step === 'details') {
      setStep('schedule');
    } else if (step === 'schedule') {
      // Start review animation
      setShowReviewAnimation(true);
      setReviewProgress(0);
      
      // Simulate review process
      const interval = setInterval(() => {
        setReviewProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // After 7 seconds, show verification requirement
            setTimeout(() => {
              setShowReviewAnimation(false);
              setStep('verification');
            }, 1000);
            return 100;
          }
          return prev + (100 / 70); // 7 seconds = 70 intervals of 100ms
        });
      }, 100);
    } else if (step === 'verification') {
      // Move to payment step
      setStep('payment');
    } else if (step === 'payment') {
      // Initiate real STK push
      await initiateSTKPush();
    } else {
      setStep('confirmation');
    }
  };

  const canProceed = () => {
    if (step === 'details') return interviewType;
    if (step === 'schedule') return selectedDate && selectedTime;
    if (step === 'payment') return phoneNumber && phoneNumber.length === 9;
    return true;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="hover:bg-white/50 transition-all duration-300 px-2 sm:px-3"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Messages</span>
                </Button>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img
                      src={logo}
                      alt={company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Book Interview</h1>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{company} • {position}</p>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                {['details', 'schedule', 'verification', 'payment', 'confirmation'].map((stepName, index) => (
                  <div
                    key={stepName}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step === stepName
                        ? 'bg-blue-500 w-6'
                        : index < ['details', 'schedule', 'verification', 'payment', 'confirmation'].indexOf(step)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Animation Overlay */}
        {showReviewAnimation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                <span className="text-2xl sm:text-4xl">🇨🇦</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Reviewing Your Application</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Our AI system is analyzing your profile and interview request...</p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${reviewProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{Math.round(reviewProgress)}% Complete</p>

              {/* Animated Steps */}
              <div className="mt-6 space-y-2 text-left">
                <div className={`flex items-center gap-2 text-sm ${reviewProgress > 20 ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  Verifying profile information
                </div>
                <div className={`flex items-center gap-2 text-sm ${reviewProgress > 50 ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  Checking interview availability
                </div>
                <div className={`flex items-center gap-2 text-sm ${reviewProgress > 80 ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizing booking details
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          {step === 'details' && (
            <div className="space-y-6">
              {/* Company Info Card */}
              <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={logo}
                        alt={company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{company}</h2>
                      <p className="text-lg text-gray-700 mb-3">{position}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {salary && (
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <Award className="w-4 h-4" />
                            {salary}
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <MapPin className="w-4 h-4" />
                            {location}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-purple-600">
                          <Star className="w-4 h-4" />
                          4.8/5 Rating
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="w-6 h-6 text-blue-500" />
                    What to Expect in Your Interview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Discussion</h4>
                        <p className="text-sm text-green-700">30-minute conversation about yourself, verification of your identity   and immigration process</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-800">Employment Contract</h4>
                        <p className="text-sm text-orange-700">Discuss the employment contract, salary and working period</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Training and Onboarding</h4>
                        <p className="text-sm text-blue-700">We will introduce you to your company and schedule a training session of what you will be doing</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Q&A Session</h4>
                        <p className="text-sm text-purple-700">Ask questions about the role and company culture</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interview Type Selection */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Camera className="w-6 h-6 text-purple-500" />
                    Choose Interview Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.type}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            interviewType === type.type
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setInterviewType(type.type)}
                        >
                          {type.popular && (
                            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                              Popular
                            </Badge>
                          )}
                          <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                              interviewType === type.type ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${
                                interviewType === type.type ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {type.duration}
                            </div>
                          </div>
                          {interviewType === type.type && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'schedule' && (
            <div className="space-y-6">
              {/* Date Selection */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="w-6 h-6 text-green-500" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableDates.map((dateOption) => (
                      <div key={dateOption.date} className="space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {dateOption.day} ({dateOption.date})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {dateOption.slots.map((time) => (
                            <Button
                              key={`${dateOption.date}-${time}`}
                              variant={selectedDate === dateOption.date && selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setSelectedDate(dateOption.date);
                                setSelectedTime(time);
                              }}
                              className={`${
                                selectedDate === dateOption.date && selectedTime === time
                                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                  : 'hover:bg-green-50 border-green-200'
                              } transition-all duration-300`}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'verification' && (
            <div className="space-y-6">
              {/* Error Message */}
              <Card className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-red-200 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-3xl">🇨🇦</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">Account Not Verified ⚠️</h3>
                    <p className="text-sm sm:text-base text-red-700 mb-3 sm:mb-4">Your account needs to be verified to complete interview bookings</p>
                    <div className="bg-white/80 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Unverified accounts cannot:</strong> Book interviews, access premium job postings, or receive work permit assistance
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        📍 <strong>To continue:</strong> Scroll to the bottom and click "Activate Account" to verify your account and complete this interview booking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits of Verification */}
              <Card className="shadow-xl">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg sm:text-2xl text-center">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                    <span>Unlock Premium Benefits with Verification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Unlimited Interviews</h4>
                        <p className="text-sm text-green-700">Book multiple interviews with top Canadian employers</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Work Permit Certificate</h4>
                        <p className="text-sm text-blue-700">Access official work permit documentation and support</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Premium Job Access</h4>
                        <p className="text-sm text-purple-700">Access up to 10 companies hiring weekly</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-800">Verified Badge</h4>
                        <p className="text-sm text-orange-700">Employers prioritize verified, real accounts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Urgency Message */}
              <Card className="bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <h4 className="font-bold text-red-800 text-sm sm:text-base">⚡ Don't Miss Out!</h4>
                  </div>
                  <p className="text-red-700 text-xs sm:text-sm">
                    This interview slot with <strong>{company}</strong> is in high demand.
                    Verify your account now to secure your booking before it's taken by another candidate!
                  </p>
                </CardContent>
              </Card>

              {/* Verification Fee */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-xl">
                <CardContent className="p-4 sm:p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <span className="text-2xl sm:text-4xl">🇨🇦</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Verification Fee</h3>
                    <div className="text-3xl sm:text-5xl font-bold text-blue-600 mb-2">KSH 250</div>
                    <p className="text-blue-700 text-sm sm:text-lg mb-4 sm:mb-6">One-time payment • Lifetime verification</p>

                    <div className="bg-blue-100 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                      <p className="text-blue-800 text-sm sm:text-lg font-medium">
                        📱 You will receive an STK prompt to complete payment and account activation
                      </p>
                    </div>

                    {/* What You Get */}
                    <div className="bg-white/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">What You Get Immediately:</h4>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3 text-left">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span>Complete this interview booking</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span>Unlimited future interviews</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span>Work permit certificate access</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span>10+ premium job postings weekly</span>
                        </div>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Enter Your Phone Number:</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border">+254</span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="712345678"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          maxLength={9}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        📱 STK push will be sent to this number for payment
                      </p>
                    </div>

                    {/* Payment Status Indicator */}
                    {paymentStatus && (
                      <div className={`rounded-xl p-4 sm:p-6 ${
                        paymentStatus === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' :
                        paymentStatus === 'SUCCESS' ? 'bg-green-50 border border-green-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {paymentStatus === 'PENDING' && (
                            <>
                              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                              <div>
                                <h4 className="font-bold text-yellow-800">Payment Processing...</h4>
                                <p className="text-sm text-yellow-700">Please check your phone and enter your M-Pesa PIN</p>
                              </div>
                            </>
                          )}
                          {paymentStatus === 'SUCCESS' && (
                            <>
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                              <div>
                                <h4 className="font-bold text-green-800">Payment Successful! ✅</h4>
                                <p className="text-sm text-green-700">Your account has been verified and activated</p>
                              </div>
                            </>
                          )}
                          {paymentStatus === 'FAILED' && (
                            <>
                              <X className="w-6 h-6 text-red-500" />
                              <div>
                                <h4 className="font-bold text-red-800">Payment Failed ❌</h4>
                                <p className="text-sm text-red-700">Please try again or contact support</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Inline Survey Ad - Shows when payment fails */}
                    {paymentStatus === 'FAILED' && (
                      <div className="mt-4">
                        <SurveyAd adIndex={2} className="max-w-sm mx-auto" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="space-y-6">
              {/* Confirmation Details */}
              <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-center">
                    <Sparkles className="w-8 h-8 text-green-500" />
                    Interview Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">You're all set! 🎉</h3>
                    <p className="text-gray-600">Your interview has been scheduled successfully</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Interview Details:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <span><strong>Company:</strong> {company}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-purple-500" />
                        <span><strong>Position:</strong> {position}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span><strong>Date:</strong> {selectedDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span><strong>Time:</strong> {selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5 text-red-500" />
                        <span><strong>Type:</strong> {interviewTypes.find(t => t.type === interviewType)?.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-gray-900">Email Confirmation</h5>
                      <p className="text-sm text-gray-600">Sent to your inbox</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-gray-900">Calendar Invite</h5>
                      <p className="text-sm text-gray-600">Added to your calendar</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                      <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-gray-900">Reminder</h5>
                      <p className="text-sm text-gray-600">24 hours before</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              Step {['details', 'schedule', 'verification', 'payment', 'confirmation'].indexOf(step) + 1} of 5
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
              {step !== 'details' && step !== 'confirmation' && step !== 'verification' && step !== 'payment' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === 'schedule') setStep('details');
                  }}
                  className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Previous
                </Button>
              )}

              {step === 'verification' && (
                <Button
                  variant="outline"
                  onClick={() => setStep('schedule')}
                  className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Back to Schedule
                </Button>
              )}

              <Button
                onClick={handleBooking}
                disabled={!canProceed() || isProcessingPayment}
                className={`${
                  canProceed() && !isProcessingPayment
                    ? step === 'payment'
                      ? paymentStatus === 'SUCCESS'
                        ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 animate-pulse'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600'
                    : 'bg-gray-300'
                } text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 sm:px-8 py-2 text-xs sm:text-sm flex-1 sm:flex-none`}
              >
                {step === 'details' && (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Continue to Scheduling
                  </>
                )}
                {step === 'schedule' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Review & Confirm
                  </>
                )}
                {step === 'verification' && (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Activate Account
                  </>
                )}
                {step === 'payment' && (
                  <>
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : paymentStatus === 'SUCCESS' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Payment Successful!
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Pay KSH 250 & Complete Booking
                      </>
                    )}
                  </>
                )}
                {step === 'confirmation' && (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Complete Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Popup Ad */}
      <PopupSurveyAd
        isOpen={popupVisible}
        onClose={hidePopupAd}
        adIndex={currentAdIndex}
      />
    </>
  );
};

export default InterviewBooking;
