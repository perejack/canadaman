import { Leaf, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Jobs', href: '#jobs' },
    { name: 'Immigration', href: '#immigration' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Disclaimer', href: '#disclaimer' }
  ];

  const services = [
    { name: 'Express Entry', href: '#express-entry' },
    { name: 'Work Permits', href: '#work-permits' },
    { name: 'Study Permits', href: '#study-permits' },
    { name: 'Family Sponsorship', href: '#family-sponsorship' },
    { name: 'Provincial Nominee Program', href: '#pnp' }
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-canadian-red rounded-lg shadow-md">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">CanadaVisa</span>
                <span className="text-xs text-muted-foreground">Your Gateway to Canada</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted partner for Canadian immigration. We help skilled professionals, 
              students, and families achieve their dreams of living and working in Canada.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">+1 (416) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">info@canadavisa.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">123 Maple Street, Toronto, ON M5V 2T6</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-foreground mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                  >
                    {service.name}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-foreground mb-6">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates on Canadian immigration news, job opportunities, and success stories.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <Button size="sm" className="w-full btn-hero">
                Subscribe
              </Button>
            </div>
            
            {/* Social Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-card-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">13,000+</div>
                <div className="text-xs text-muted-foreground">Successful Immigrants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-card-border bg-muted">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2025 CanadaVisa. All rights reserved.</span>
              <div className="flex space-x-4">
                {legalLinks.map((link, index) => (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Regulated by</span>
                <span className="font-semibold text-primary">ICCRC</span>
              </div>
              <div className="w-6 h-4 bg-canadian-red rounded-sm shadow-sm" 
                   title="Proudly Canadian" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;