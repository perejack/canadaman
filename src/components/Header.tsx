import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Leaf } from 'lucide-react';
import { useScrollToTop, scrollToTop, scrollToElement } from '@/hooks/useScrollToTop';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use the scroll to top hook for route changes
  useScrollToTop();

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Jobs', href: '#jobs' },
    { name: 'Immigration', href: '#immigration' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove the '#'
    
    // Special case for home - scroll to very top
    if (targetId === 'home') {
      scrollToTop();
      setIsMenuOpen(false);
      return;
    }
    
    // Use the utility function to scroll to element
    scrollToElement(targetId, 80);
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    try {
      const raw = localStorage.getItem('canadaJobsApplicationData');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.redirectToSignup) {
          localStorage.removeItem('canadaJobsApplicationData');
        }
      }
    } catch {
      // ignore
    }

    setIsMenuOpen(false);
    navigate('/account');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md overflow-hidden">
              <img 
                src="/images/canada-flag-logo.jpg" 
                alt="Canada Flag Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">CanadaVisa</span>
              <span className="text-xs text-muted-foreground">Your Gateway to Canada</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="btn-outline-canadian" onClick={handleLoginClick}>
              Login
            </Button>
            <Link to="/apply">
              <Button size="sm" className="btn-hero">
                Start Application
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link py-2"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Button variant="outline" size="sm" className="btn-outline-canadian" onClick={handleLoginClick}>
                  Login
                </Button>
                <Link to="/apply">
                  <Button size="sm" className="btn-hero">
                    Start Application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;