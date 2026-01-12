import { useState, useCallback, useRef, useEffect } from 'react';

interface SurveyAdsState {
  popupVisible: boolean;
  currentAdIndex: number;
}

interface AdQueueItem {
  delay: number;
  adIndex: number;
}

export function useSurveyAds() {
  const [state, setState] = useState<SurveyAdsState>({
    popupVisible: false,
    currentAdIndex: 0,
  });

  const adQueue = useRef<AdQueueItem[]>([]);
  const isProcessingQueue = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processAdQueue = useCallback(() => {
    if (isProcessingQueue.current || adQueue.current.length === 0) {
      return;
    }
    
    isProcessingQueue.current = true;
    const nextAd = adQueue.current.shift()!;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState({
        popupVisible: true,
        currentAdIndex: nextAd.adIndex,
      });
    }, nextAd.delay);
  }, []);

  const showPopupAd = useCallback((delay: number = 0, adIndex: number = 0) => {
    // Add to queue
    adQueue.current.push({ delay, adIndex });
    
    // Process queue if not already processing
    if (!isProcessingQueue.current) {
      processAdQueue();
    }
  }, [processAdQueue]);

  const hidePopupAd = useCallback(() => {
    setState({
      popupVisible: false,
      currentAdIndex: 0,
    });
    
    // Mark current ad as processed
    isProcessingQueue.current = false;
    
    // Process next ad in queue after a short delay (1 second)
    setTimeout(() => {
      processAdQueue();
    }, 1000);
  }, [processAdQueue]);

  // Function to show multiple ads in sequence
  const showAdSequence = useCallback((ads: { delay: number; adIndex: number }[]) => {
    ads.forEach(ad => {
      adQueue.current.push(ad);
    });
    
    if (!isProcessingQueue.current) {
      processAdQueue();
    }
  }, [processAdQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    popupVisible: state.popupVisible,
    currentAdIndex: state.currentAdIndex,
    showPopupAd,
    hidePopupAd,
    showAdSequence,
  };
}
