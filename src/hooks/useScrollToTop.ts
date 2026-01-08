import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when route changes
 * Provides smooth scrolling behavior for better UX
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior when route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, location.search]);
};

/**
 * Utility function to scroll to top programmatically
 * Can be called from any component
 */
export const scrollToTop = (smooth: boolean = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

/**
 * Utility function to scroll to a specific element
 * Accounts for fixed header height
 */
export const scrollToElement = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
  }
};
