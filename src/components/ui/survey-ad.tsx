import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import survey images
import surveyImage1 from '@/assets/survay1.jpeg';
import surveyImage2 from '@/assets/survay2.jpeg';
import surveyImage3 from '@/assets/survay3.jpeg';
import surveyImage4 from '@/assets/survay4.jpeg';

const SURVEY_PLATFORM_URL = 'https://www.earntasking.online/?ref=canadavisa';

interface SurveyAdConfig {
  id: string;
  imageUrl: string;
  ctaText: string;
  badge: string;
}

const surveyAds: SurveyAdConfig[] = [
  {
    id: 'survey-1',
    imageUrl: surveyImage1,
    ctaText: 'Start Earning Now',
    badge: '🔥 50,000+ USERS'
  },
  {
    id: 'survey-2',
    imageUrl: surveyImage2,
    ctaText: 'Claim KES 200 Now',
    badge: '⚡ LIMITED TIME'
  },
  {
    id: 'survey-3',
    imageUrl: surveyImage3,
    ctaText: 'Start Making Money',
    badge: '💰 HIGH PAYING'
  },
  {
    id: 'survey-4',
    imageUrl: surveyImage4,
    ctaText: 'Get Cash Now',
    badge: '⚡ INSTANT PAY'
  }
];

interface SurveyAdProps {
  adIndex?: number;
  onClose?: () => void;
  className?: string;
}

export function SurveyAd({ adIndex = 0, onClose, className = '' }: SurveyAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const ad = surveyAds[adIndex % surveyAds.length];

  const handleClick = () => {
    // Track click with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_ad_click', {
        ad_id: ad.id,
        ad_url: SURVEY_PLATFORM_URL,
        timestamp: new Date().toISOString()
      });
    }

    // Open in new tab
    window.open(SURVEY_PLATFORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
    
    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_ad_dismiss', {
        ad_id: ad.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    // Track impression
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'survey_ad_impression', {
        ad_id: ad.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [ad.id]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer transition-transform hover:scale-105 max-h-[85vh] ${className}`}
      onClick={handleClick}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-200 hover:scale-110"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
        Sponsored
      </div>

      {/* Image */}
      <img 
        src={ad.imageUrl} 
        alt="Survey Ad" 
        className="w-full h-auto object-cover max-h-[70vh]"
      />

      {/* CTA Button */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {ad.ctaText}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

interface PopupSurveyAdProps {
  isOpen: boolean;
  onClose: () => void;
  adIndex?: number;
  displayDuration?: number;
}

export function PopupSurveyAd({ 
  isOpen, 
  onClose, 
  adIndex = 0, 
  displayDuration = 8000 
}: PopupSurveyAdProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100); // Reset progress when closed
      return;
    }

    // Reset progress when a new ad opens
    setProgress(100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (displayDuration / 100));
        if (newProgress <= 0) {
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, displayDuration, onClose, adIndex]); // Added adIndex to dependencies

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[9998]"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            className="fixed inset-x-4 top-4 z-[9999] max-w-sm mx-auto"
            style={{ maxHeight: 'calc(100vh - 32px)' }}
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <SurveyAd 
              adIndex={adIndex} 
              onClose={onClose}
              className="shadow-2xl"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
