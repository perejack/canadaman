import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, DollarSign, Clock, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Babysitter',
    company: 'Bright Horizons',
    companyLogo: '/images/companies/bright-horizons.jpg',
    category: 'Childcare',
    salary: 'Typically around minimum wage to about $4,333',
    description: 'Care for children in private homes. Flexible work with competitive compensation.',
    roles: ['Supervise children during daily activities', 'Prepare meals and snacks', 'Assist with homework and educational activities'],
    type: 'Part-time',
    image: '/images/nanny.jpg'
  },
  {
    id: 2,
    title: 'Bartender',
    company: 'Boston Pizza',
    companyLogo: '/images/companies/boston-pizza.jpg',
    category: 'Hospitality',
    salary: 'Up to $4,333 (including tips)',
    description: 'Mix drinks and serve patrons in vibrant settings. Enjoy tips and competitive earnings.',
    roles: ['Mix and serve alcoholic and non-alcoholic beverages', 'Take orders and process payments', 'Maintain bar cleanliness and inventory'],
    type: 'Part-time',
    image: '/images/bartender.jpg'
  },
  {
    id: 3,
    title: 'Caretaker & Building Superintendent',
    company: 'Canadian Tire',
    companyLogo: '/images/companies/canadian-tire.jpg',
    category: 'Maintenance',
    salary: '$3,033 - $4,000',
    description: 'Ensure facilities are clean and well-maintained. Enjoy stable employment with varied responsibilities that keep your day interesting.',
    roles: ['Perform routine building maintenance and repairs', 'Monitor security systems and property', 'Handle tenant requests and emergencies'],
    type: 'Full-time',
    image: '/images/Caretaker & Building Superintendent.jpg'
  },
  {
    id: 4,
    title: 'Casino Worker',
    company: 'Great Northern Casino',
    companyLogo: '/images/companies/generic-canadian-4.jpg',
    category: 'Entertainment',
    salary: 'Varies widely; typically around minimum wage plus tips',
    description: 'Join Canada\'s exciting gaming industry. Various positions available with competitive base pay plus tips.',
    roles: ['Operate gaming equipment and assist players', 'Process transactions and handle cash', 'Ensure compliance with gaming regulations'],
    type: 'Full-time',
    image: '/images/casino-worker.jpg'
  },
  {
    id: 5,
    title: 'Chef',
    company: 'Four Seasons Hotels',
    companyLogo: '/images/companies/four-seasons.jpg',
    category: 'Culinary',
    salary: '$3,120 - $5,200',
    description: 'Showcase your culinary talents in a vibrant kitchen environment. Create delicious dishes with opportunities for growth in the culinary arts.',
    roles: ['Prepare and cook menu items to quality standards', 'Manage kitchen inventory and food costs', 'Train and supervise kitchen staff'],
    type: 'Full-time',
    image: '/images/chef.jpg'
  },
  {
    id: 6,
    title: 'Driver',
    company: 'Uber Canada',
    companyLogo: '/images/companies/uber.jpg',
    category: 'Transportation',
    salary: 'Typically around minimum wage to about $4,333',
    description: 'Transport people and goods across Canada. Various driving positions with competitive pay.',
    roles: ['Transport passengers or goods safely and efficiently', 'Maintain vehicle cleanliness and perform basic checks', 'Navigate routes and manage delivery schedules'],
    type: 'Full-time',
    image: '/images/driver.jpg'
  },
  {
    id: 7,
    title: 'Dry Cleaning Worker',
    company: 'Maple Cleaners',
    companyLogo: '/images/companies/maple-cleaners.jpg',
    category: 'Service',
    salary: 'Up to $3,466',
    description: 'Help keep clothes fresh and clean in a fast-paced environment. Provide quality service while earning competitive wages.',
    roles: ['Process garments through cleaning equipment', 'Inspect items for stains and damage', 'Provide customer service and handle transactions'],
    type: 'Full-time',
    image: '/images/dry-cleaning-worker.jpg'
  },
  {
    id: 8,
    title: 'Electrician',
    company: 'Home Depot Canada',
    companyLogo: '/images/companies/home-depot.jpg',
    category: 'Skilled Trades',
    salary: 'Approximately $5,200 - $6,933',
    description: 'Join Canada\'s skilled trades sector. High-demand profession with excellent compensation.',
    roles: ['Install and maintain electrical systems', 'Troubleshoot electrical problems and repairs', 'Ensure compliance with electrical codes and safety'],
    type: 'Full-time',
    image: '/images/electrician.jpg'
  },
  {
    id: 9,
    title: 'Fish Plant Worker',
    company: 'Atlantic Seafood Co.',
    companyLogo: '/images/companies/atlantic-seafood.jpg',
    category: 'Manufacturing',
    salary: '$3,033 - $4,333',
    description: 'Contribute to the seafood industry by processing high-quality fish products. Enjoy competitive wages in a dynamic work environment.',
    roles: ['Process and package seafood products', 'Operate processing equipment safely', 'Maintain quality control and food safety standards'],
    type: 'Full-time',
    image: '/images/fish-plant-worker.jpg'
  },
  {
    id: 10,
    title: 'Gardener',
    company: 'Northern Landscapes',
    companyLogo: '/images/companies/northern-landscapes.jpg',
    category: 'Landscaping',
    salary: '$2,600 - $3,466',
    description: 'Cultivate beautiful landscapes and nurture plants in a rewarding outdoor role. Enjoy competitive pay while enhancing nature\'s beauty.',
    roles: ['Plant, water, and maintain gardens and landscapes', 'Operate lawn care equipment and tools', 'Design and implement landscaping projects'],
    type: 'Full-time',
    image: '/images/gardener.jpg'
  },
  {
    id: 11,
    title: 'Hostess',
    company: 'Tim Hortons',
    companyLogo: '/images/companies/tim-hortons.jpg',
    category: 'Hospitality',
    salary: 'Minimum wage to about $3,120 (plus tips)',
    description: 'Welcome guests in Canada\'s hospitality sector. Entry-level positions with earning potential through tips.',
    roles: ['Greet and seat guests in restaurant', 'Manage reservations and waiting lists', 'Coordinate with kitchen and serving staff'],
    type: 'Part-time',
    image: '/images/hostess.jpeg'
  },
  {
    id: 12,
    title: 'Hotel Front Desk Clerk',
    company: 'Marriott Hotels',
    companyLogo: '/images/companies/marriott.jpg',
    category: 'Hospitality',
    salary: '$2,840 - $3,773',
    description: 'Be the first point of contact for guests, providing exceptional service and support. Work in a lively atmosphere with opportunities for career growth.',
    roles: ['Check guests in and out of hotel', 'Handle reservations and room assignments', 'Resolve guest complaints and requests'],
    type: 'Full-time',
    image: '/images/clerk.jpg'
  },
  {
    id: 13,
    title: 'Hotel Valet',
    company: 'Hilton Hotels',
    companyLogo: '/images/companies/hilton.jpg',
    category: 'Hospitality',
    salary: 'Around minimum wage to about $3,120 (plus tips)',
    description: 'Provide premium service at Canadian hotels. Entry-level position with tip earning potential.',
    roles: ['Park and retrieve guest vehicles', 'Provide luggage assistance and directions', 'Maintain professional appearance and service'],
    type: 'Part-time',
    image: '/images/hotel valet.jpg'
  },
  {
    id: 14,
    title: 'Housekeeper',
    company: 'Molly Maid',
    companyLogo: '/images/companies/molly-maid.jpg',
    category: 'Cleaning',
    salary: '$2,600 - $2,960',
    description: 'Create inviting spaces for guests and residents. Enjoy flexible hours while making a difference in people\'s daily lives.',
    roles: ['Clean and maintain guest rooms and common areas', 'Change linens and restock amenities', 'Report maintenance issues and damages'],
    type: 'Part-time',
    image: '/images/housekeeper.jpg'
  },
  {
    id: 15,
    title: 'Housekeeping Staff',
    company: 'Best Western Hotels',
    companyLogo: '/images/companies/best-western.jpg',
    category: 'Cleaning',
    salary: 'Up to $3,120',
    description: 'Join our professional housekeeping team. Flexible schedules and opportunities for advancement in the hospitality industry.',
    roles: ['Perform deep cleaning of hotel facilities', 'Coordinate with housekeeping team', 'Maintain inventory of cleaning supplies'],
    type: 'Full-time',
    image: '/images/housekeeping staff.jpg'
  },
  {
    id: 16,
    title: 'Janitor & Building Superintendent',
    company: 'Canadian Properties',
    companyLogo: '/images/companies/generic-canadian-1.jpg',
    category: 'Maintenance',
    salary: '$3,033 - $4,000',
    description: 'Ensure facilities are clean and well-maintained. Enjoy stable employment with varied responsibilities that keep your day interesting.',
    roles: ['Maintain cleanliness of buildings and facilities', 'Perform minor repairs and maintenance', 'Monitor security and safety protocols'],
    type: 'Full-time',
    image: '/images/janitor.jpg'
  },
  {
    id: 17,
    title: 'Kitchen Helper',
    company: 'McDonald\'s Canada',
    companyLogo: '/images/companies/mcdonalds.jpg',
    category: 'Culinary',
    salary: '$2,600 - $2,960',
    description: 'Support the kitchen team by preparing ingredients and maintaining cleanliness. Start your journey in the culinary world.',
    requirements: ['Food safety knowledge', 'Team work', 'Physical stamina'],
    type: 'Part-time',
    image: '/images/kitchen-helper.jpg'
  },
  {
    id: 18,
    title: 'Light Duty Cleaner',
    company: 'Clean Pro Services',
    companyLogo: '/images/companies/generic-canadian-2.jpg',
    category: 'Cleaning',
    salary: 'Up to $3,120',
    description: 'Help maintain cleanliness in various settings with flexible hours that fit your schedule. Contribute to overall hygiene and workplace safety.',
    requirements: ['Attention to detail', 'Reliability', 'Basic cleaning skills'],
    type: 'Part-time',
    image: '/images/lightdutycleaner.jpg'
  },
  {
    id: 19,
    title: 'Machine Operator',
    company: 'Bombardier Inc.',
    companyLogo: '/images/companies/bombardier.jpg',
    category: 'Manufacturing',
    salary: 'Approximately minimum wage to about $4,333',
    description: 'Operate equipment in Canadian manufacturing. Technical role with competitive compensation.',
    requirements: ['Technical aptitude', 'Safety training', 'Attention to detail'],
    type: 'Full-time',
    image: '/images/machine operator.png'
  },
  {
    id: 20,
    title: 'Nanny',
    company: 'Bright Horizons',
    companyLogo: '/images/companies/bright-horizons.jpg',
    category: 'Childcare',
    salary: '$2,600 - $4,333',
    description: 'Make a lasting impact on children\'s lives by providing care and guidance. Enjoy a fulfilling role with flexible hours that fit your lifestyle.',
    requirements: ['Childcare experience', 'First aid certification', 'Background check'],
    type: 'Full-time',
    image: '/images/nanny.jpg'
  },
  {
    id: 21,
    title: 'Parent\'s Helper',
    company: 'Family Care Plus',
    companyLogo: '/images/companies/generic-canadian-3.jpg',
    category: 'Childcare',
    salary: 'Typically around minimum wage to about $4,333',
    description: 'Support families with childcare and household duties. Entry-level caregiving position.',
    requirements: ['Childcare interest', 'Reliability', 'Flexible schedule'],
    type: 'Part-time',
    image: '/images/nanny.jpg'
  },
  {
    id: 22,
    title: 'Plumber',
    company: 'Lowe\'s Canada',
    companyLogo: '/images/companies/lowes.jpg',
    category: 'Skilled Trades',
    salary: '$5,200 - $6,933',
    description: 'Join the essential trade of plumbing, where you can solve problems and improve systems. Enjoy high demand for your skills with competitive pay.',
    requirements: ['Plumbing certification', '2+ years experience', 'Valid license'],
    type: 'Full-time',
    image: '/images/plumber.jpg'
  },
  {
    id: 23,
    title: 'Receptionist',
    company: 'Professional Services Inc.',
    companyLogo: '/images/companies/generic-canadian-4.jpg',
    category: 'Administrative',
    salary: 'Approximately minimum wage to about $3,786',
    description: 'Support Canadian businesses in administrative roles. Professional environment with benefits.',
    requirements: ['Communication skills', 'Computer proficiency', 'Professional demeanor'],
    type: 'Full-time',
    image: '/images/receptionist.jpg'
  },
  {
    id: 24,
    title: 'Secretary',
    company: 'Corporate Solutions',
    companyLogo: '/images/companies/generic-canadian-5.jpg',
    category: 'Administrative',
    salary: 'Approximately minimum wage to about $3,786',
    description: 'Provide administrative support in professional environments. Opportunities for career advancement.',
    requirements: ['Administrative experience', 'Computer skills', 'Organization skills'],
    type: 'Full-time',
    image: '/images/receptionist.jpg'
  },
  {
    id: 25,
    title: 'Security Guard',
    company: 'Garda Security',
    companyLogo: '/images/companies/garda.jpg',
    category: 'Security',
    salary: '$2,773 - $3,466',
    description: 'Protect people and property while ensuring safety in diverse environments. Opportunities for career advancement.',
    requirements: ['Security license', 'Physical fitness', 'Alert mindset'],
    type: 'Full-time',
    image: '/images/security-guard.jpg'
  },
  {
    id: 26,
    title: 'Specialized Cleaner',
    company: 'Elite Cleaning Services',
    companyLogo: '/images/companies/maple-cleaners.jpg',
    category: 'Cleaning',
    salary: 'Up to $4,333',
    description: 'Use your skills to tackle unique cleaning challenges in specialized environments. Enjoy competitive pay in a specialized role.',
    requirements: ['Specialized cleaning training', 'Attention to detail', 'Safety protocols'],
    type: 'Full-time',
    image: '/images/specialized-cleaner.webp'
  },
  {
    id: 27,
    title: 'Store Keeper',
    company: 'Loblaws',
    companyLogo: '/images/companies/loblaws.jpg',
    category: 'Retail',
    salary: 'Minimum wage to around $3,466',
    description: 'Manage inventory and operations in retail settings. Various positions with competitive compensation.',
    requirements: ['Inventory management', 'Customer service', 'Organization skills'],
    type: 'Full-time',
    image: '/images/storekeeper.jpg'
  },
  {
    id: 28,
    title: 'Welder',
    company: 'Canadian Steel Works',
    companyLogo: '/images/companies/generic-canadian-1.jpg',
    category: 'Skilled Trades',
    salary: '$4,333 - $6,066',
    description: 'Join the skilled trades and help shape the future with your welding expertise. Enjoy competitive pay while working on exciting projects in various industries.',
    requirements: ['Welding certification', 'Safety training', '2+ years experience'],
    type: 'Full-time',
    image: '/images/welder.jpg'
  }
];

const categories = ['All', 'Childcare', 'Hospitality', 'Maintenance', 'Entertainment', 'Culinary', 'Transportation', 'Service', 'Skilled Trades', 'Manufacturing', 'Landscaping', 'Cleaning', 'Administrative', 'Security', 'Retail'];
const jobTypes = ['All', 'Full-time', 'Part-time'];

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <section id="jobs" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-canadian-red">Canada Jobs</span> with Visa Sponsorship 2025
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find High-Paying Jobs Abroad with Accommodation. Discover exciting career opportunities 
            with competitive salaries and benefits.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card border border-card-border rounded-2xl p-6 mb-12 shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 focus-canadian"
              />
            </div>

            {/* Mobile Category Toggle Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full flex items-center justify-between h-12 text-left"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories ({selectedCategory})
                </span>
                {showAllCategories ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Category Filter - Desktop Always Visible, Mobile Collapsible */}
            <div className={`${showAllCategories ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      // Auto-collapse on mobile after selection
                      if (window.innerWidth < 768) {
                        setShowAllCategories(false);
                      }
                    }}
                    className={`${selectedCategory === category ? "bg-canadian-red text-white hover:bg-canadian-red/90" : "hover:bg-canadian-red/10"} transition-all duration-200`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Job Type:</span>
              <div className="flex gap-2 flex-wrap">
                {jobTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={`${selectedType === type ? "bg-canadian-blue text-white hover:bg-canadian-blue/90" : "hover:bg-canadian-blue/10"} transition-all duration-200`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-primary">{filteredJobs.length}</span> jobs
          </p>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card-job group overflow-hidden">
              {/* Job Image */}
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img 
                  src={job.image} 
                  alt={`${job.title} professional at work`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={job.type === 'Full-time' ? 'default' : 'outline'} className="bg-white/90 text-foreground shadow-sm">
                    {job.type}
                  </Badge>
                </div>
              </div>

              {/* Company Image */}
              {job.companyLogo && (
                <div className="mb-4">
                  <div className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={job.companyLogo} 
                      alt={`${job.company} office`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">
                      {job.company}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    {job.category}
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {job.description}
              </p>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Key Roles:</h4>
                <ul className="space-y-1">
                  {(job.roles || job.requirements || []).map((role, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Salary and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-card-border">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">{job.salary}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <Link to={`/apply?job=${encodeURIComponent(job.title)}`}>
                  <Button size="sm" className="btn-hero">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="btn-outline-canadian">
            Load More Jobs
          </Button>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-canadian-red text-white rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Canadian Journey?</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don't miss out on these incredible opportunities. Start your application today 
            and take the first step towards your new life in Canada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm">
              Check Eligibility
            </Button>
            <Link to="/apply">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Application
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobListings;