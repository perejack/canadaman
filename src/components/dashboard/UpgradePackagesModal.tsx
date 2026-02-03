import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Crown,
  Star,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  Phone,
  Shield,
  Zap,
  Globe,
  Users,
  Briefcase
} from 'lucide-react';
import { trackPaymentConversion } from '../../utils/googleTracking';
import { useSurveyAds } from '@/hooks/useSurveyAds';
import { SurveyAd, PopupSurveyAd } from '@/components/ui/survey-ad';

interface UpgradePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (packageType: 'premium' | 'platinum') => void;
  userId?: string;
}

const UpgradePackagesModal: React.FC<UpgradePackagesModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgradeSuccess,
  userId,
}) => {
  const { popupVisible, currentAdIndex, showPopupAd, hidePopupAd, showAdSequence } = useSurveyAds();
  const [selectedPackage, setSelectedPackage] = useState<'premium' | 'platinum' | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [paymentStatusInterval, setPaymentStatusInterval] = useState<NodeJS.Timeout | null>(null);

  const packages = {
    premium: {
      name: 'Premium Package',
      price: 250, // Updated amount
      color: 'from-blue-500 to-purple-600',
      icon: Crown,
      popular: true,
      benefits: [
        '🏆 Guaranteed job placement assistance',
        '🏥 Medical insurance coverage',
        '✅ Unlimited job applications per day',
        '🎯 Priority application processing',
        '📧 Email support within 24 hours',
        '📊 Application tracking dashboard',
        '🔔 Job alert notifications',
        '📋 Resume optimization tips',
        '💼 Access to premium job listings'
      ]
    },
    platinum: {
      name: 'Platinum Package',
      price: 250, // Updated amount
      color: 'from-yellow-500 to-orange-600',
      icon: Star,
      popular: false,
      benefits: [
        '✅ Everything in Premium Package',
        '🏆 Guaranteed job placement assistance',
        '🏥 Medical insurance coverage',
        '🏠 Accommodation assistance on arrival',
        '📞 24/7 phone support hotline',
        '✈️ Airport pickup arrangement',
        '📄 Work permit processing help',
        '🎓 Skills certification assistance',
        '👥 Dedicated account manager'
      ]
    }
  };

  // STK Push Functions
  const initiateSTKPush = async (packageType: 'premium' | 'platinum') => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      alert("Please enter a valid phone number");
      return;
    }
    
    setIsProcessingPayment(true);
    setPaymentStatus('PENDING');
    
    try {
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `254${phoneNumber}`,
          amount: packages[packageType].price,
          description: `${packages[packageType].name} Upgrade`,
          purpose: 'application',
          userId: userId || null,
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const requestId = result.data.checkoutRequestId || result.data.externalReference;
        setCheckoutRequestId(requestId);
        
        alert(`📱 STK push sent! Please check your phone and enter your M-Pesa PIN to pay KSH ${packages[packageType].price}.`);
        
        // Start polling for payment status
        startPaymentStatusPolling(requestId, packageType);
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

  const startPaymentStatusPolling = (requestId: string, packageType: 'premium' | 'platinum') => {
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
            alert(`🎉 Payment Successful! Your account has been upgraded to ${packages[packageType].name}!`);
            onUpgradeSuccess(packageType);
            onClose();

            // Show sequence of survey ads on payment success
            showAdSequence([
              { delay: 500, adIndex: 1 },
              { delay: 0, adIndex: 0 }
            ]);

            // Track conversion with Google Ads
            trackPaymentConversion({
              transactionId: requestId,
              value: packages[packageType].price,
              currency: 'KES',
              itemName: packages[packageType].name,
              itemId: packageType
            });
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Upgrade Your Account
              </h2>
              <p className="text-gray-600 mt-1">Upgrade your account to apply to more companies and enjoy other features</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Packages */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(packages).map(([key, pkg]) => {
              const PackageIcon = pkg.icon;
              const isSelected = selectedPackage === key;
              
              return (
                <Card 
                  key={key}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPackage(key as 'premium' | 'platinum')}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                      <PackageIcon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-center text-xl">{pkg.name}</CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-900">KSH {pkg.price}</span>
                      <span className="text-gray-500 ml-2">one-time</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 pb-6">
                    {pkg.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                    
                    {/* Package Selection Button */}
                    <div className="pt-4">
                      <Button 
                        className={`w-full py-3 font-semibold transition-all duration-300 bg-gradient-to-r ${pkg.color} text-white hover:shadow-lg hover:scale-105 active:scale-95`}
                        onClick={() => {
                          setSelectedPackage(key as 'premium' | 'platinum');
                          setShowPaymentModal(true);
                        }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Choose This Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="relative p-6 pb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPhoneNumber('');
                  setPaymentStatus(null);
                  setIsProcessingPayment(false);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${packages[selectedPackage].color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Complete Your Upgrade
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  {packages[selectedPackage].name}
                </p>
                <div className="text-2xl font-bold text-gray-900">
                  KSH {packages[selectedPackage].price}
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="px-6 pb-4">
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Enter Your Phone Number:</h4>
                <div className="flex items-stretch gap-2 max-w-xs mx-auto">
                  <div className="bg-white px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center min-w-[60px]">
                    +254
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="712345678"
                    className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-center"
                    maxLength={9}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3" />
                  STK push will be sent to this number for payment
                </p>
              </div>

              {/* Payment Status Indicator */}
              {paymentStatus && (
                <div className={`rounded-2xl p-4 mb-4 ${
                  paymentStatus === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' :
                  paymentStatus === 'SUCCESS' ? 'bg-green-50 border border-green-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {paymentStatus === 'PENDING' && (
                      <>
                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <h4 className="font-bold text-yellow-800 text-sm">Payment Processing...</h4>
                          <p className="text-xs text-yellow-700">Check your phone and enter M-Pesa PIN</p>
                        </div>
                      </>
                    )}
                    {paymentStatus === 'SUCCESS' && (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <h4 className="font-bold text-green-800 text-sm">Payment Successful! ✅</h4>
                          <p className="text-xs text-green-700">Account upgraded successfully</p>
                        </div>
                      </>
                    )}
                    {paymentStatus === 'FAILED' && (
                      <>
                        <X className="w-6 h-6 text-red-500" />
                        <div>
                          <h4 className="font-bold text-red-800 text-sm">Payment Failed ❌</h4>
                          <p className="text-xs text-red-700">Please try again</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Inline Survey Ad - Shows when payment fails */}
              {paymentStatus === 'FAILED' && (
                <div className="mb-4">
                  <SurveyAd adIndex={3} className="max-w-sm mx-auto" />
                </div>
              )}

              {/* Upgrade Button */}
              <Button 
                onClick={() => initiateSTKPush(selectedPackage)}
                disabled={!phoneNumber || phoneNumber.length !== 9 || isProcessingPayment}
                className={`w-full py-4 text-base font-bold rounded-2xl transition-all duration-300 ${
                  phoneNumber && phoneNumber.length === 9 && !isProcessingPayment
                    ? `bg-gradient-to-r ${packages[selectedPackage].color} hover:shadow-xl hover:scale-105 active:scale-95 text-white`
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Pay KSH {packages[selectedPackage].price}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
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

export default UpgradePackagesModal;
