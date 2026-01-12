import { Users, Briefcase, ArrowRight } from 'lucide-react';
import rutoImage from '@/assets/ruto.jpg';
import workforceImage from '@/assets/canadian-workforce.jpg';

const ImmigrationPathways = () => {
  return (
    <section id="immigration" className="section-padding bg-surface-elevated">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Your{' '}
            <span className="text-canadian-red">Canadian Opportunities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With the recent partnership between the Government of Kenya and Canada, 
            there has never been a better time to explore immigration opportunities.
          </p>
        </div>

        {/* Partnership Highlight - Modern Card Design */}
        <div className="relative bg-card border border-card-border rounded-3xl p-8 mb-16 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-canadian-red"></div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="bg-canadian-red p-3 rounded-full mr-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Canada-Kenya Partnership</h3>
              </div>
              <p className="text-lg text-muted-foreground">
                Official partnership creating unprecedented opportunities for Kenyan professionals, 
                students, and families to build their future in Canada.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-80 h-60 rounded-xl overflow-hidden shadow-lg border-4 border-canadian-red/20">
                <img 
                  src={rutoImage} 
                  alt="Canada-Kenya Partnership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Join Canada's Workforce Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={workforceImage} 
                alt="Join Canada's Workforce"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Briefcase className="w-6 h-6" />
                  <span className="font-semibold">Over 13,000 Kenyans have successfully immigrated to Canada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center space-x-3 bg-canadian-blue/10 text-canadian-blue px-4 py-2 rounded-full">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Immigration Pathway</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Join Canada's Workforce
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Canada is actively seeking skilled professionals to fill critical roles in various sectors, including healthcare, technology, and engineering.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Express Entry System</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Fast-track processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">High demand sectors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">Supportive community</span>
              </div>
            </div>

            <button className="inline-flex items-center px-6 py-3 bg-canadian-blue text-white rounded-lg hover:bg-canadian-blue-deep transition-colors duration-300 group">
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImmigrationPathways;