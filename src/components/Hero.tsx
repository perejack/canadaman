import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import heroImage from '@/assets/hero-canada.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful Canadian cityscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white animate-slide-up">
        <div className="max-w-4xl mx-auto">
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-white/90">Trusted by 13,000+ Kenyans</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight heading-display">
            Find the Best Jobs in{' '}
            <span className="text-canadian-red inline-block animate-float">
              Canada
            </span>
            <br />
            with Visa Sponsorship
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
            Your path to a brighter future in Canada starts here. Join thousands who have successfully immigrated.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="btn-hero text-lg px-8 py-4 group"
              onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Application
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Clean Stats Bar */}
          <div className="relative max-w-4xl mx-auto mb-16">
            {/* Stats Container */}
            <div className="flex justify-between items-center relative">
              {/* Stat 1 */}
              <div className="group cursor-pointer text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors duration-300">13K+</div>
                <div className="text-white/80 text-sm font-medium">Successful Applications</div>
              </div>

              {/* Stat 2 */}
              <div className="group cursor-pointer text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">6M</div>
                <div className="text-white/80 text-sm font-medium">Average Processing</div>
              </div>

              {/* Stat 3 */}
              <div className="group cursor-pointer text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">95%</div>
                <div className="text-white/80 text-sm font-medium">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;