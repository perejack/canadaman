import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, GraduationCap, Briefcase, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

// Kenyan counties for address selection
const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega',
  'Nyeri', 'Machakos', 'Meru', 'Kericho', 'Embu', 'Migori', 'Homa Bay', 'Naivasha', 'Voi', 'Wajir',
  'Isiolo', 'Nanyuki', 'Marsabit', 'Mumias', 'Webuye', 'Busia', 'Siaya', 'Kisii', 'Bomet', 'Kapenguria',
  'Lodwar', 'Mandera', 'Moyale', 'Maralal', 'Lamu', 'Kilifi', 'Kwale', 'Taita Taveta', 'Kajiado', 'Makueni',
  'Kitui', 'Tharaka Nithi', 'Mwingi', 'Laikipia', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
  'Nandi', 'Baringo', 'West Pokot', 'Turkana'
];

// Form validation schema
const applicationSchema = z.object({
  // Personal Details
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  nationality: z.string().default('Kenyan'),
  id_number: z.string().min(1, 'ID number is required'),
  
  // Address Information
  county: z.string().min(1, 'County is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Please provide a complete address'),
  
  // Education Background
  education_level: z.enum(['primary', 'secondary', 'certificate', 'diploma', 'bachelor', 'master', 'phd'], {
    required_error: 'Please select your education level',
  }),
  institution_name: z.string().min(2, 'Institution name is required'),
  course_study: z.string().min(2, 'Course/field of study is required'),
  graduation_year: z.coerce.number().min(1980).max(new Date().getFullYear()),
  
  // Work Experience
  years_experience: z.coerce.number().min(0).max(50),
  current_position: z.string().optional(),
  previous_employer: z.string().optional(),
  
  // Application Details
  position_applied: z.string().min(2, 'Position applied for is required'),
  cover_letter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  languages: z.array(z.string()).min(1, 'Please add at least one language'),
  certifications: z.array(z.string()).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const steps = [
  { id: 1, title: 'Personal Details', icon: User, description: 'Basic information about yourself' },
  { id: 2, title: 'Education', icon: GraduationCap, description: 'Your educational background' },
  { id: 3, title: 'Experience', icon: Briefcase, description: 'Work experience and skills' },
  { id: 4, title: 'Application', icon: FileText, description: 'Position and cover letter' },
  { id: 5, title: 'Review', icon: CheckCircle, description: 'Review and submit' },
];

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>(['']);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [certifications, setCertifications] = useState<string[]>(['']);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      nationality: 'Kenyan',
      years_experience: 0,
      skills: [],
      languages: ['English'],
      certifications: [],
    },
  });

  const progressPercentage = (currentStep / steps.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof ApplicationFormData)[] => {
    switch (step) {
      case 1:
        return ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender', 'id_number', 'county', 'city', 'address'];
      case 2:
        return ['education_level', 'institution_name', 'course_study', 'graduation_year'];
      case 3:
        return ['years_experience', 'skills', 'languages'];
      case 4:
        return ['position_applied', 'cover_letter'];
      default:
        return [];
    }
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
    form.setValue('skills', newSkills.filter(skill => skill.trim() !== ''));
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    form.setValue('skills', newSkills.filter(skill => skill.trim() !== ''));
  };

  const addLanguage = () => {
    setLanguages([...languages, '']);
  };

  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);
    form.setValue('languages', newLanguages.filter(lang => lang.trim() !== ''));
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      const newLanguages = languages.filter((_, i) => i !== index);
      setLanguages(newLanguages);
      form.setValue('languages', newLanguages.filter(lang => lang.trim() !== ''));
    }
  };

  const addCertification = () => {
    setCertifications([...certifications, '']);
  };

  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
    form.setValue('certifications', newCertifications.filter(cert => cert.trim() !== ''));
  };

  const removeCertification = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    form.setValue('certifications', newCertifications.filter(cert => cert.trim() !== ''));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const insertData = {
        ...data,
        skills: data.skills.filter(skill => skill.trim() !== ''),
        languages: data.languages.filter(lang => lang.trim() !== ''),
        certifications: data.certifications?.filter(cert => cert.trim() !== '') || [],
      };

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('applications')
        .insert({
          job_title: data.position_applied,
          pending_email: data.email,
          source: 'application_form',
          user_id: userData.user?.id ?? null,
          data: insertData as any,
        });

      if (error) throw error;

      toast.success('Application submitted successfully!', {
        description: 'We will review your application and get back to you soon.',
      });

      form.reset();
      setCurrentStep(1);
      setSkills(['']);
      setLanguages(['English']);
      setCertifications(['']);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application', {
        description: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+254 700 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kenyanCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Town</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your complete address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        const educationLevel = form.watch("education_level");
        const showEducationDetails = educationLevel && educationLevel !== "primary" && educationLevel !== "secondary";
        
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="education_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showEducationDetails && (
                <FormField
                  control={form.control}
                  name="graduation_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl>
                        <Input type="number" min="1980" max={new Date().getFullYear()} placeholder="2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {showEducationDetails && (
              <>
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="University of Nairobi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="course_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course/Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="50" placeholder="3" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total years of relevant work experience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="current_position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Position (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previous_employer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Employer (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Company Ltd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Skills</FormLabel>
              <FormDescription className="mb-3">
                Add your key skills and competencies
              </FormDescription>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder="e.g., JavaScript, Project Management"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSkill(index)}
                      disabled={skills.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSkill}>
                  Add Skill
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>Languages</FormLabel>
              <FormDescription className="mb-3">
                Languages you can speak fluently
              </FormDescription>
              <div className="space-y-2">
                {languages.map((language, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={language}
                      onChange={(e) => updateLanguage(index, e.target.value)}
                      placeholder="e.g., English, Swahili"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeLanguage(index)}
                      disabled={languages.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLanguage}>
                  Add Language
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>Certifications (Optional)</FormLabel>
              <FormDescription className="mb-3">
                Professional certifications you have earned
              </FormDescription>
              <div className="space-y-2">
                {certifications.map((certification, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={certification}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      placeholder="e.g., AWS Certified Developer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeCertification(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCertification}>
                  Add Certification
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="position_applied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Applied For</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you're interested in this position and what makes you a great candidate..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 50 characters. Explain your motivation and relevant experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        const formData = form.getValues();
        return (
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h4 className="font-medium text-lg mb-4">Review Your Application</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">Personal Information</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Location:</strong> {formData.city}, {formData.county}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Education</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Level:</strong> {formData.education_level}</p>
                    <p><strong>Institution:</strong> {formData.institution_name}</p>
                    <p><strong>Course:</strong> {formData.course_study}</p>
                    <p><strong>Year:</strong> {formData.graduation_year}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Experience</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Years:</strong> {formData.years_experience}</p>
                    <p><strong>Position:</strong> {formData.position_applied}</p>
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Languages</h5>
                  <div className="flex flex-wrap gap-1">
                    {formData.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-medium mb-2">Cover Letter</h5>
                <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                  {formData.cover_letter}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-primary">
                By submitting this application, you confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="section-padding bg-surface">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Apply for Employment in Canada
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete this application form to start your journey toward employment opportunities in Canada.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-primary bg-primary text-white' 
                        : isCompleted 
                        ? 'border-success bg-success text-white'
                        : 'border-muted-foreground bg-background text-muted-foreground'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Progress value={progressPercentage} className="w-full h-2" />
          </div>

          {/* Form */}
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6" })}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}