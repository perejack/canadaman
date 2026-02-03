import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Heart, 
  Star, 
  CheckCircle, 
  MapPin, 
  Zap, 
  Target, 
  Building, 
  Users, 
  Clock, 
  DollarSign, 
  Leaf,
  Award,
  Briefcase,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  GraduationCap,
  BookOpen,
  School,
  FileText,
  Globe,
  Home,
  UserCheck
} from 'lucide-react';
import { scrollToTop } from '@/hooks/useScrollToTop';

interface InteractiveApplicationFormProps {
  jobTitle: string;
}

// Job image mapping function - matches all jobs from JobListings.tsx
const getJobImage = (jobTitle: string): string | null => {
  const imageMap: { [key: string]: string } = {
    'Babysitter': '/images/nanny.jpg',
    'Bartender': '/images/bartender.jpg',
    'Caretaker & Building Superintendent': '/images/Caretaker & Building Superintendent.jpg',
    'Casino Worker': '/images/casino-worker.jpg',
    'Chef': '/images/chef.jpg',
    'Driver': '/images/driver.jpg',
    'Dry Cleaning Worker': '/images/dry-cleaning-worker.jpg',
    'Electrician': '/images/electrician.jpg',
    'Fish Plant Worker': '/images/fish-plant-worker.jpg',
    'Gardener': '/images/gardener.jpg',
    'Hostess': '/images/hostess.jpeg',
    'Hotel Front Desk Clerk': '/images/clerk.jpg',
    'Hotel Valet': '/images/hotel valet.jpg',
    'Housekeeper': '/images/housekeeper.jpg',
    'Housekeeping Staff': '/images/housekeeping staff.jpg',
    'Janitor & Building Superintendent': '/images/janitor.jpg',
    'Kitchen Helper': '/images/kitchen-helper.jpg',
    'Light Duty Cleaner': '/images/lightdutycleaner.jpg',
    'Machine Operator': '/images/machine operator.png',
    'Nanny': '/images/nanny.jpg',
    'Parent\'s Helper': '/images/nanny.jpg',
    'Plumber': '/images/plumber.jpg',
    'Receptionist': '/images/receptionist.jpg',
    'Secretary': '/images/receptionist.jpg',
    'Security Guard': '/images/security-guard.jpg',
    'Specialized Cleaner': '/images/specialized-cleaner.webp',
    'Store Keeper': '/images/storekeeper.jpg',
    'Welder': '/images/welder.jpg'
  };
  
  return imageMap[jobTitle] || null;
};

// Job-specific questions and requirements
const jobQuestions = {
  'Babysitter': {
    icon: Heart,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50',
    image: '👶',
    emoji: '💕',
    description: 'Caring for children with love and responsibility',
    questions: [
      { id: 'childcare_experience', label: 'How many years of childcare experience do you have?', type: 'select', options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'] },
      { id: 'age_groups', label: 'Which age groups are you comfortable caring for?', type: 'select', options: ['Infants (0-1)', 'Toddlers (1-3)', 'Preschool (3-5)', 'School age (5+)', 'All ages'] },
      { id: 'first_aid', label: 'Do you have first aid certification?', type: 'select', options: ['Yes, current', 'Yes, expired', 'No, but willing to get', 'No'] }
    ]
  },
  'Chef': {
    icon: Award,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    image: '👨‍🍳',
    emoji: '🍽️',
    description: 'Creating culinary masterpieces in Canadian kitchens',
    questions: [
      { id: 'cuisine_specialty', label: 'What type of cuisine do you specialize in?', type: 'select', options: ['International', 'Italian', 'Asian', 'French', 'Canadian', 'Fusion'] },
      { id: 'kitchen_experience', label: 'How many years of professional kitchen experience?', type: 'select', options: ['1-2 years', '3-5 years', '5-10 years', '10+ years'] },
      { id: 'food_safety', label: 'Do you have food safety certification?', type: 'select', options: ['Yes, current', 'Yes, expired', 'No, but willing to get'] }
    ]
  },
  'Driver': {
    icon: MapPin,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    image: '🚗',
    emoji: '🛣️',
    description: 'Navigating Canadian roads with safety and precision',
    questions: [
      { id: 'license_class', label: 'What class of driving license do you have?', type: 'select', options: ['Class 5 (Regular)', 'Class 4 (Taxi/Uber)', 'Class 3 (Truck)', 'Class 1 (Commercial)'] },
      { id: 'driving_experience', label: 'How many years of driving experience?', type: 'select', options: ['1-3 years', '3-5 years', '5-10 years', '10+ years'] },
      { id: 'clean_record', label: 'Do you have a clean driving record?', type: 'select', options: ['Yes, completely clean', 'Minor violations only', 'Some violations'] }
    ]
  },
  'Electrician': {
    icon: Zap,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    image: '⚡',
    emoji: '🔌',
    description: 'Powering Canadian homes and businesses',
    questions: [
      { id: 'certification_level', label: 'What level of electrical certification do you have?', type: 'select', options: ['Apprentice', 'Journeyman', 'Master Electrician', 'No certification yet'] },
      { id: 'electrical_experience', label: 'Years of electrical work experience?', type: 'select', options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'] },
      { id: 'specialization', label: 'What type of electrical work do you prefer?', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'All types'] }
    ]
  },
  'Security Guard': {
    icon: Users,
    color: 'bg-gray-600',
    lightColor: 'bg-gray-50',
    image: '🛡️',
    emoji: '🔒',
    description: 'Protecting Canadian communities with vigilance',
    questions: [
      { id: 'security_license', label: 'Do you have a security license?', type: 'select', options: ['Yes, current', 'Yes, expired', 'No, but willing to get'] },
      { id: 'security_experience', label: 'Years of security experience?', type: 'select', options: ['No experience', '1-2 years', '3-5 years', '5+ years'] },
      { id: 'shift_preference', label: 'What shifts can you work?', type: 'select', options: ['Day shifts only', 'Night shifts only', 'Any shift', 'Weekends only'] }
    ]
  },
  'Casino Worker': {
    icon: Users,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    image: '🎰',
    emoji: '🎲',
    description: 'Join Canada\'s exciting gaming industry with competitive pay',
    questions: [
      { id: 'gaming_license', label: 'Do you have a gaming license?', type: 'select', options: ['Yes, current', 'Yes, expired', 'No, but willing to get'] },
      { id: 'casino_experience', label: 'Years of casino/hospitality experience?', type: 'select', options: ['No experience', '1-2 years', '3-5 years', '5+ years'] },
      { id: 'shift_availability', label: 'What shifts can you work?', type: 'select', options: ['Day shifts', 'Evening shifts', 'Night shifts', 'Any shift', 'Weekends only'] }
    ]
  },
  'Gardener': {
    icon: Leaf,
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    image: '🌱',
    emoji: '🌿',
    description: 'Cultivating beautiful landscapes and nurturing Canadian gardens',
    questions: [
      { id: 'gardening_experience', label: 'How many years of gardening experience do you have?', type: 'select', options: ['No experience', '1-2 years', '3-5 years', '5+ years'] },
      { id: 'plant_knowledge', label: 'What type of plants are you most familiar with?', type: 'select', options: ['Flowers & ornamentals', 'Vegetables & herbs', 'Trees & shrubs', 'All types'] },
      { id: 'seasonal_availability', label: 'What seasons can you work?', type: 'select', options: ['Spring/Summer only', 'Fall/Winter only', 'All seasons', 'Flexible'] }
    ]
  }
};

// Form schema
const applicationSchema = z.object({
  // Personal Information
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  id_number: z.string().min(1, 'ID/Birth certificate number required'),
  location: z.string().min(2, 'Location required'),
  marital_status: z.string().min(1, 'Please select marital status'),
  
  // Contact Information
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  
  // Experience & Education
  experience_years: z.string().min(1, 'Please select your experience'),
  education_level: z.string().min(1, 'Please select education level'),
  field_of_study: z.string().optional(),
  institution: z.string().optional(),
  graduation_year: z.string().optional(),
  
  // Job-specific questions
  job_specific_1: z.string().optional(),
  job_specific_2: z.string().optional(),
  job_specific_3: z.string().optional(),
  
  // Motivation & Plans
  motivation: z.string().min(1, 'Please select your motivation'),
  stay_duration: z.string().min(1, 'Please select how long you plan to stay'),
  
  // Availability & Documents
  availability: z.string().min(1, 'Please select your availability'),
  passport_status: z.string().min(1, 'Please select passport status'),
  preferred_hours: z.string().min(1, 'Please select preferred working hours'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const InteractiveApplicationForm: React.FC<InteractiveApplicationFormProps> = ({ jobTitle }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const jobConfig = jobQuestions[jobTitle as keyof typeof jobQuestions] || {
    icon: Briefcase,
    color: 'bg-canadian-blue',
    lightColor: 'bg-canadian-blue-light',
    image: '💼',
    emoji: '🇨🇦',
    description: 'Building your career in beautiful Canada',
    questions: []
  };

  // Debug logging
  console.log('Job Title:', jobTitle);
  console.log('Job Config Found:', !!jobQuestions[jobTitle as keyof typeof jobQuestions]);
  console.log('Get Job Image Result:', getJobImage(jobTitle));
  console.log('Job Config:', jobConfig);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      experience_years: '',
      motivation: '',
      availability: '',
    },
  });

  const encouragementMessages = [
    "🌟 You're doing great! Canadian employers love motivated candidates like you!",
    "🚀 Excellent! Your profile is looking very attractive to hiring managers!",
    "💼 Perfect! You're exactly what Canadian companies are looking for!",
    "🎯 Amazing! Your experience makes you a top candidate for this position!",
    "⭐ Outstanding! You're on track to land your dream job in Canada!"
  ];

  useEffect(() => {
    const newProgress = ((currentStep + 1) / 6) * 100;
    setProgress(newProgress);
    
    if (currentStep > 0) {
      setEncouragementMessage(encouragementMessages[Math.min(currentStep - 1, encouragementMessages.length - 1)]);
    }
  }, [currentStep]);

  // Scroll to top when processing starts
  useEffect(() => {
    if (isProcessing) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isProcessing]);

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of form when moving to next step
      scrollToTop();
    }
  };

  const getFieldsForStep = (step: number): (keyof ApplicationFormData)[] => {
    switch (step) {
      case 0: return ['first_name', 'last_name', 'date_of_birth', 'id_number', 'location', 'marital_status'];
      case 1: return ['email', 'phone'];
      case 2: return ['experience_years', 'education_level'];
      case 3: return ['job_specific_1', 'job_specific_2', 'job_specific_3'];
      case 4: return ['motivation', 'stay_duration'];
      case 5: return ['availability', 'passport_status', 'preferred_hours'];
      default: return [];
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsProcessing(true);
    
    try {
      const userId = (() => {
        try {
          const raw = localStorage.getItem('canadaJobsUser');
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          return parsed?.id || null;
        } catch {
          return null;
        }
      })();

      const payload = {
        phone: data.phone,
        email: data.email,
        fullName: `${data.first_name} ${data.last_name}`.trim(),
        jobTitle,
        userId,
        projectData: {
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          id_number: data.id_number,
          location: data.location,
          marital_status: data.marital_status,
          experience_years: data.experience_years,
          education_level: data.education_level,
          field_of_study: data.field_of_study,
          institution: data.institution,
          graduation_year: data.graduation_year,
          job_specific_1: data.job_specific_1,
          job_specific_2: data.job_specific_2,
          job_specific_3: data.job_specific_3,
          motivation: data.motivation,
          stay_duration: data.stay_duration,
          availability: data.availability,
          passport_status: data.passport_status,
          preferred_hours: data.preferred_hours,
        }
      };

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || result?.message || 'Failed to submit application');
      }

      setSubmittedApplicationId(result?.data?.applicationId || null);
      setSubmittedEmail(data.email || null);
      setSubmittedPhone(data.phone || null);

      setIsProcessing(false);
      setShowSuccess(true);
    } catch (err: any) {
      console.error('Submit application error:', err);
      setIsProcessing(false);
      alert(err?.message || 'Failed to submit application. Please try again.');
    }
  };

  if (showSuccess) {
    return <SuccessPage jobTitle={jobTitle} applicationId={submittedApplicationId} email={submittedEmail} phone={submittedPhone} />;
  }

  if (isProcessing) {
    return <ProcessingAnimation />;
  }

  const IconComponent = jobConfig.icon;

  return (
    <div className="min-h-screen py-4 sm:py-8 lg:py-12 px-3 sm:px-4 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          {/* Job Icon and Image */}
          <div className="relative mb-4 sm:mb-6">
            {getJobImage(jobTitle) ? (
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6">
                <img 
                  src={getJobImage(jobTitle)!}
                  alt={jobTitle} 
                  className={`w-full h-32 sm:h-40 lg:h-48 rounded-lg sm:rounded-xl object-cover shadow-lg sm:shadow-xl border-2 ${jobConfig.color.replace('bg-', 'border-')}`}
                />
              </div>
            ) : (
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${jobConfig.color} text-white mb-4 shadow-xl animate-scale-in relative`}>
                  <IconComponent className="w-12 h-12" />
                </div>
                <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                  {jobConfig.image}
                </div>
              </div>
            )}
          </div>
          
          {/* Title with Modern Typography */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-foreground mb-3 sm:mb-4 leading-tight px-2">
            Apply for{' '}
            <span className="text-canadian-red bg-canadian-red-light px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl inline-block transform -rotate-1 shadow-md text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              {jobTitle}
            </span>
          </h1>
          
          {/* Job Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed px-4">
            {jobConfig.description}
          </p>
          
          {/* Canadian Flag and Emoji */}
          <div className="flex items-center justify-center space-x-4 text-2xl">
            <span className="animate-pulse">{jobConfig.emoji}</span>
            <span className="text-canadian-red font-bold">•</span>
            <span className="animate-pulse">🇨🇦</span>
            <span className="text-canadian-blue font-bold">•</span>
            <span className="animate-pulse">✨</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of 6</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted">
            <div className={`h-full ${jobConfig.color} rounded-full transition-all duration-500 ease-out`} 
                 style={{ width: `${progress}%` }} />
          </Progress>
          {encouragementMessage && (
            <div className="mt-3 p-4 bg-success-light border border-success/20 rounded-xl animate-fade-in">
              <p className="text-success text-sm font-medium">
                {encouragementMessage}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <Card className="shadow-lg sm:shadow-xl border border-card-border bg-surface-elevated mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent(currentStep, form, jobConfig, jobTitle)}
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 px-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(Math.max(0, currentStep - 1));
                      // Scroll to top of form when moving to previous step
                      scrollToTop();
                    }}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    Previous
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className={`${jobConfig.color} hover:opacity-90 text-white px-6 sm:px-8 py-2 sm:py-3 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto text-sm sm:text-base`}
                    >
                      Continue <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className={`${jobConfig.color} hover:opacity-90 text-white px-6 sm:px-8 py-2 sm:py-3 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto text-sm sm:text-base`}
                    >
                      Submit Application <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const renderStepContent = (step: number, form: any, jobConfig: any, jobTitle: string) => {
  switch (step) {
    case 0:
      return (
        <div className="text-center space-y-8">
          {/* Step Visual */}
          <div className="relative">
            {getJobImage(jobTitle) ? (
              <div className="relative w-full max-w-sm mx-auto mb-6">
                <img 
                  src={getJobImage(jobTitle)!}
                  alt={jobTitle} 
                  className={`w-full h-40 rounded-xl object-cover shadow-2xl border-2 ${jobConfig.color.replace('bg-', 'border-')}`}
                />
              </div>
            ) : (
              <div>
                <div className="text-8xl mb-4 animate-bounce">🚀</div>
                <div className="absolute -top-2 -right-8 text-3xl animate-pulse">✨</div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-2 sm:mb-3 px-2">Personal Information</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed px-4 mb-4 sm:mb-6">
              Tell us about yourself to personalize your Canadian journey
            </p>
          </div>
          
          <div className="space-y-6 px-2">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      👤 First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-lg sm:rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      👤 Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-lg sm:rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date of Birth and ID Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-canadian-blue" /> Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-lg sm:rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-canadian-blue" /> ID/Birth Certificate Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your ID or birth certificate number"
                        className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-lg sm:rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-canadian-red" /> Current Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Nairobi, Kenya"
                      className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-lg sm:rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marital Status */}
            <FormField
              control={form.control}
              name="marital_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-canadian-red" /> Marital Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base sm:text-lg p-3 sm:p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-lg sm:rounded-xl">
                        <SelectValue placeholder="Select your marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">💙 Single</SelectItem>
                      <SelectItem value="married">💍 Married</SelectItem>
                      <SelectItem value="prefer-not-say">🤐 Rather not say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 1:
      return (
        <div className="text-center space-y-8">
          {/* Step Visual with Background */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden">
              <img 
                src="/images/steps/contact-step.jpg" 
                alt="Canadian Office" 
                className="w-full h-32 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Contact Information</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              How can Canadian employers reach you for exciting opportunities?
            </p>
          </div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Mail className="w-5 h-5 text-canadian-blue" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@email.com" 
                      {...field} 
                      className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-canadian-blue" /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+254 (700) 123-456" 
                      {...field} 
                      className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 2:
      const educationLevel = form.watch('education_level');
      const showEducationDetails = educationLevel && ['university', 'college'].includes(educationLevel);
      
      return (
        <div className="text-center space-y-8">
          {/* Step Visual with Professional Background */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden">
              <img 
                src="/images/success/canadian-workplace.jpg" 
                alt="Professional Development" 
                className="w-full h-32 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Experience & Education</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tell us about your professional journey and educational background
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Experience Level */}
            <FormField
              control={form.control}
              name="experience_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    🏆 Years of Experience
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">🌱 Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="junior">🌿 Junior (1-3 years)</SelectItem>
                      <SelectItem value="intermediate">🌳 Intermediate (3-5 years)</SelectItem>
                      <SelectItem value="senior">🌲 Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Education Level */}
            <FormField
              control={form.control}
              name="education_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-canadian-blue" /> Level of Education
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">📚 Primary Education</SelectItem>
                      <SelectItem value="secondary">🎓 Secondary Education</SelectItem>
                      <SelectItem value="college">🏫 College</SelectItem>
                      <SelectItem value="university">🎓 University</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional Education Details */}
            {showEducationDetails && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-canadian-blue-light rounded-xl border border-canadian-blue/20">
                  <h3 className="text-lg font-semibold text-canadian-blue mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Education Details
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Field of Study */}
                    <FormField
                      control={form.control}
                      name="field_of_study"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <School className="w-4 h-4 text-canadian-blue" /> Field of Study
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Business Administration, Engineering, etc."
                              className="text-base p-3 border-2 focus:border-canadian-blue transition-all duration-300 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Institution */}
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Building className="w-4 h-4 text-canadian-blue" /> Institution Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name of your school/college/university"
                              className="text-base p-3 border-2 focus:border-canadian-blue transition-all duration-300 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Graduation Year */}
                    <FormField
                      control={form.control}
                      name="graduation_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-canadian-blue" /> Year of Graduation
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 2020"
                              min="1950"
                              max="2030"
                              className="text-base p-3 border-2 focus:border-canadian-blue transition-all duration-300 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 3:
      const questions = jobConfig.questions || [];
      return (
        <div className="text-center space-y-8">
          {/* Step Visual with Job-Specific Image */}
          <div className="relative">
            <div className="text-8xl mb-4 animate-bounce">{jobConfig.image}</div>
            <div className="absolute -top-4 -right-6 text-3xl animate-pulse">{jobConfig.emoji}</div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3 sm:mb-4 px-2">
              Apply for {jobTitle}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
              {jobConfig.description}
            </p>
          </div>
          <div className="space-y-6">
            {questions.map((question: any, index: number) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`job_specific_${index + 1}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      {index === 0 && '🎯'}
                      {index === 1 && '📊'}
                      {index === 2 && '🏅'}
                      {question.label}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {question.options.map((option: string) => (
                          <SelectItem key={option} value={option} className="text-base py-3">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      );

    case 4:
      return (
        <div className="text-center space-y-8">
          {/* Step Visual with Motivation Background */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden">
              <img 
                src="/images/success/processing-2.jpg" 
                alt="Canadian Success" 
                className="w-full h-32 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Your Motivation & Plans</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tell us what excites you about working as a {jobTitle} in beautiful Canada and your future plans
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Motivation */}
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    💬 Your Motivation
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 h-14 border-2 focus:border-canadian-red transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select what motivates you to work in Canada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="career-growth">🚀 I want to advance my career and gain new skills in a developed country</SelectItem>
                      <SelectItem value="family-future">👨‍👩‍👧‍👦 I want to build a better future for my family in a safe environment</SelectItem>
                      <SelectItem value="economic-opportunity">💰 I'm attracted to Canada's strong economy and job opportunities</SelectItem>
                      <SelectItem value="cultural-diversity">🌍 I appreciate Canada's multicultural society and inclusive values</SelectItem>
                      <SelectItem value="quality-life">🏞️ I want to enjoy Canada's high quality of life and work-life balance</SelectItem>
                      <SelectItem value="education-healthcare">🏥 I value Canada's excellent education and healthcare systems</SelectItem>
                      <SelectItem value="permanent-residence">🏠 I want to eventually become a Canadian permanent resident or citizen</SelectItem>
                      <SelectItem value="professional-development">💻 I want to work with advanced technology and professional standards</SelectItem>
                      <SelectItem value="language-skills">🗣️ I want to improve my English/French language skills</SelectItem>
                      <SelectItem value="contribute-society">🤝 I want to contribute my skills to Canadian society and economy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stay Duration */}
            <FormField
              control={form.control}
              name="stay_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-canadian-blue" /> How long do you plan to stay in Canada?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select your intended stay duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="permanent">🏡 Permanent residence - I want to make Canada my home</SelectItem>
                      <SelectItem value="temporary">⏰ Temporarily - For a few years to gain experience</SelectItem>
                      <SelectItem value="contract-based">📋 As per my work contract - Flexible based on opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 5:
      return (
        <div className="text-center space-y-8">
          {/* Step Visual with Celebration Background */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden">
              <img 
                src="/images/success/success-celebration.jpg" 
                alt="Canadian Celebration" 
                className="w-full h-32 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Start Your Journey</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Let's finalize the details for your exciting new career adventure in Canada
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    🚀 When can you start?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="When can you start your Canadian journey?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediately">⚡ Immediately</SelectItem>
                      <SelectItem value="1-month">📅 Within 1 month</SelectItem>
                      <SelectItem value="2-months">🗓️ Within 2 months</SelectItem>
                      <SelectItem value="3-months">📆 Within 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passport Status */}
            <FormField
              control={form.control}
              name="passport_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-canadian-blue" /> Do you have a passport?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-blue transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select your passport status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">✅ Yes, I have a valid passport</SelectItem>
                      <SelectItem value="no">❌ No, but I can get one</SelectItem>
                      <SelectItem value="help-apply">🆘 Help me apply once qualified</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Working Hours */}
            <FormField
              control={form.control}
              name="preferred_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-canadian-red" /> Preferred working hours
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-canadian-red transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Select your preferred working schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">🕘 Full-time (40+ hours/week)</SelectItem>
                      <SelectItem value="part-time">🕐 Part-time (20-30 hours/week)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

const ProcessingAnimation = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = [
    { text: "🔍 Analyzing your qualifications...", icon: Target },
    { text: "🏢 Matching with Canadian employers...", icon: Building },
    { text: "📋 Checking visa sponsorship eligibility...", icon: CheckCircle },
    { text: "💰 Reviewing salary expectations...", icon: DollarSign },
    { text: "👥 Connecting with hiring managers...", icon: Users },
    { text: "✨ Finalizing your application...", icon: Sparkles }
  ];

  const canadianImages = [
    { src: "/images/success/processing-1.jpg", alt: "Canadian Workplace" },
    { src: "/images/success/canadian-workplace.jpg", alt: "Professional Environment" },
    { src: "/images/success/processing-2.jpg", alt: "Canadian Success" },
    { src: "/images/steps/contact-step.jpg", alt: "Modern Office" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
      setCurrentImage(prev => (prev + 1) % canadianImages.length);
      setProgress(prev => Math.min(prev + 16.67, 100));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = messages[currentMessage].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface pt-20 sm:pt-24">
      <div className="text-center space-y-8 max-w-lg mx-auto p-8">
        {/* Enhanced Visual with Canadian Images */}
        <div className="relative">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <img 
              src={canadianImages[currentImage].src}
              alt={canadianImages[currentImage].alt}
              className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-canadian-red animate-pulse"
            />
            <div className="absolute inset-0 bg-canadian-red/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <CurrentIcon className="w-8 h-8 text-canadian-red animate-bounce" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Processing Your Application</h2>
          <p className="text-xl text-canadian-red font-medium mb-6 animate-pulse">
            {messages[currentMessage].text}
          </p>
          <Progress value={progress} className="h-4 bg-muted">
            <div className="h-full bg-canadian-red rounded-full transition-all duration-500" 
                 style={{ width: `${progress}%` }} />
          </Progress>
          <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% Complete</p>
        </div>

        <div className="bg-secondary-light p-4 rounded-xl border border-secondary/20">
          <p className="text-secondary text-sm">
            🎯 <strong>Did you know?</strong> Canada has over 1 million job openings and actively seeks skilled workers like you!
          </p>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = ({ jobTitle, applicationId, email, phone }: { jobTitle: string; applicationId: string | null; email: string | null; phone: string | null }) => {
  const companies = [
    { 
      name: "Tim Hortons", 
      logo: "/images/companies/tim-hortons.jpg", 
      hiring: "12 positions",
      isImage: true 
    },
    { 
      name: "Marriott Hotels", 
      logo: "/images/companies/marriott.jpg", 
      hiring: "8 positions",
      isImage: true 
    },
    { 
      name: "Home Depot Canada", 
      logo: "/images/companies/home-depot.jpg", 
      hiring: "15 positions",
      isImage: true 
    },
    { 
      name: "Four Seasons Hotels", 
      logo: "/images/companies/four-seasons.jpg", 
      hiring: "6 positions",
      isImage: true 
    },
    { 
      name: "Boston Pizza", 
      logo: "/images/companies/boston-pizza.jpg", 
      hiring: "9 positions",
      isImage: true 
    },
    { 
      name: "Canadian Tire", 
      logo: "/images/companies/canadian-tire.jpg", 
      hiring: "11 positions",
      isImage: true 
    }
  ];

  return (
    <div className="min-h-screen bg-success-light p-4 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Enhanced Success Visual with Canadian Celebration */}
        <div className="relative">
          <div className="relative w-48 h-32 mx-auto mb-6 rounded-xl overflow-hidden">
            <img 
              src="/images/success/success-celebration.jpg"
              alt="Canadian Success Celebration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-success/20 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center animate-bounce shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 sm:space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-3xl sm:text-4xl">✅</div>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight px-2">
              Application Successfully Submitted
            </h1>
            <div className="w-24 sm:w-32 h-1 bg-canadian-red mx-auto rounded-full"></div>
          </div>
          
          {/* Subtitle */}
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Excellent news! We've identified{' '}
              <span className="font-semibold text-canadian-red bg-canadian-red-light px-2 py-1 rounded-md">
                41 companies
              </span>{' '}
              actively recruiting for{' '}
              <span className="font-semibold text-foreground">
                {jobTitle}
              </span>{' '}
              positions across Canada.
            </p>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-card-border">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Companies Ready to Hire You
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              These employers are actively seeking candidates with your profile
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-card-border hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  {company.isImage ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                      <img 
                        src={company.logo} 
                        alt={`${company.name} office`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl">{company.logo}</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <p className="text-sm text-success">{company.hiring}</p>
                  </div>
                </div>
                <Badge className="bg-canadian-red text-white hover:bg-canadian-red-deep">
                  Hiring Now
                </Badge>
              </div>
            ))}
          </div>

          <div className="bg-canadian-red p-4 sm:p-6 rounded-xl text-white shadow-canadian">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">🚀 Next Steps to Secure Your Job</h3>
            <div className="text-left space-y-3 sm:space-y-2">
              <p className="text-sm sm:text-base leading-relaxed">✅ Your profile has been sent to hiring managers</p>
              <p className="text-sm sm:text-base leading-relaxed">✅ Companies will review your application and send you an interview request after the interview your canadian immigration process will start</p>
              <p className="text-sm sm:text-base leading-relaxed">✅ Check your portal dashboard invitations to see companies who are interested in hiring to secure your interviews</p>
              <p className="text-sm sm:text-base leading-relaxed font-semibold">⏰ Job offers typically come within 1-2 weeks</p>
              <p className="text-sm sm:text-base leading-relaxed font-semibold bg-white/20 p-3 rounded-lg mt-4">🔐 Create an account below to complete your application process</p>
            </div>
          </div>
        </div>

        <div className="bg-canadian-red-light border-2 border-canadian-red rounded-xl p-4 sm:p-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-canadian-red mb-3">
            🔐 Access Immigration Portal
          </h3>
          <p className="text-canadian-red-deep mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
            To complete your hiring process and receive job offers, please <strong>click the link below</strong> to create your account in the Canadian Immigration Portal where employers can contact you directly.
          </p>
          <Button 
            className="bg-canadian-red hover:bg-canadian-red-deep text-white px-6 sm:px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-semibold"
            onClick={() => {
              // Store application data for pre-filling the signup form
              const applicationData = {
                jobTitle,
                applicationId,
                email,
                phone,
                redirectToSignup: true
              };
              localStorage.setItem('canadaJobsApplicationData', JSON.stringify(applicationData));
              window.location.href = '/account';
            }}
          >
            Click Here to Create Account <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveApplicationForm;
