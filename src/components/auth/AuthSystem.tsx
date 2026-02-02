import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Phone,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Job positions for dropdown
const jobPositions = [
  'Babysitter', 'Bartender', 'Caretaker & Building Superintendent', 'Casino Worker',
  'Chef', 'Driver', 'Dry Cleaning Worker', 'Electrician', 'Fish Plant Worker',
  'Gardener', 'Hostess', 'Hotel Front Desk Clerk', 'Hotel Valet', 'Housekeeper',
  'Housekeeping Staff', 'Janitor & Building Superintendent', 'Kitchen Helper',
  'Light Duty Cleaner', 'Machine Operator', 'Nanny', 'Parent\'s Helper',
  'Plumber', 'Receptionist', 'Secretary', 'Security Guard', 'Specialized Cleaner',
  'Store Keeper', 'Welder'
];

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  positionApplied: z.string().min(1, 'Please select a position')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

interface AuthSystemProps {
  onLogin: (userData: any) => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      location: '',
      dateOfBirth: '',
      positionApplied: ''
    }
  });

  // Debug: Watch form values
  const watchedValues = registerForm.watch();
  console.log('Form values:', watchedValues);

  // Check for application data on component mount
  useEffect(() => {
    const storedApplicationData = localStorage.getItem('canadaJobsApplicationData');
    if (storedApplicationData) {
      try {
        const appData = JSON.parse(storedApplicationData);
        setApplicationData(appData);
        
        // If redirectToSignup is true, show signup form
        if (appData.redirectToSignup) {
          setIsLogin(false);
          
          // Reset the form to ensure all fields are editable
          registerForm.reset({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phone: '',
            location: '',
            dateOfBirth: '',
            positionApplied: appData.jobTitle || ''
          });
          
          // Clear the stored data after using it
          localStorage.removeItem('canadaJobsApplicationData');
        }
      } catch (error) {
        console.error('Error parsing application data:', error);
        localStorage.removeItem('canadaJobsApplicationData');
      }
    }
  }, [registerForm]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
            phone: data.phone,
            location: data.location,
            date_of_birth: data.dateOfBirth,
            position_applied: data.positionApplied,
          },
        },
      });

      if (error) throw error;

      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            username: data.username,
            full_name: data.fullName,
            phone: data.phone,
            location: data.location,
            date_of_birth: data.dateOfBirth,
            position_applied: data.positionApplied,
          });

        if (profileError) throw profileError;
      }

      setRegistrationSuccess(true);

      if (signUpData.session?.user) {
        const { error: claimError } = await supabase.rpc('claim_applications_for_current_user');
        if (claimError) {
          console.error('Failed to claim existing applications:', claimError);
        }

        const mappedUser = {
          id: signUpData.session.user.id,
          username: data.username,
          email: signUpData.session.user.email,
          fullName: data.fullName,
          phone: data.phone,
          location: data.location,
          dateOfBirth: data.dateOfBirth,
          positionApplied: data.positionApplied,
          accountStatus: 'basic',
        };

        setTimeout(() => {
          onLogin(mappedUser);
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    
    // Reset forms when switching modes
    if (newMode) {
      // Switching to login
      loginForm.reset();
    } else {
      // Switching to signup
      registerForm.reset({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        location: '',
        dateOfBirth: '',
        positionApplied: applicationData?.jobTitle || ''
      });
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      if (!signInData.user) throw new Error('Missing user');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      const { error: claimError } = await supabase.rpc('claim_applications_for_current_user');
      if (claimError) {
        console.error('Failed to claim existing applications:', claimError);
      }

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      const mappedUser = {
        id: signInData.user.id,
        username: profile?.username ?? signInData.user.email?.split('@')[0] ?? 'user',
        email: signInData.user.email,
        fullName: profile?.full_name ?? '',
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        dateOfBirth: profile?.date_of_birth ?? '',
        positionApplied: profile?.position_applied ?? '',
        accountStatus: profile?.account_status ?? 'basic',
      };

      onLogin(mappedUser);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-canadian-red-light via-white to-canadian-blue-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Account Created Successfully! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              {applicationData?.jobTitle 
                ? `Perfect! Your ${applicationData.jobTitle} application is now connected to your account. You're being redirected to your dashboard where companies are waiting to interview you!`
                : 'Welcome to Canada Jobs Portal! You\'re being redirected to your dashboard...'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-canadian-red">
              <div className="w-2 h-2 bg-canadian-red rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-canadian-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-canadian-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canadian-red-light via-white to-canadian-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl shadow-lg overflow-hidden mx-auto mb-4">
            <img 
              src="/images/canada-flag-logo.jpg" 
              alt="Canada Flag Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Canada Jobs Portal</h1>
          <p className="text-muted-foreground">Your Gateway to Canadian Opportunities</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              {isLogin ? (
                <>
                  <LogIn className="w-6 h-6 text-canadian-blue" />
                  Welcome Back
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6 text-canadian-red" />
                  Create Account
                </>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of successful job seekers'}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {isLogin ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Mail className="w-4 h-4 text-canadian-blue" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="h-12 border-2 focus:border-canadian-blue transition-all duration-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Lock className="w-4 h-4 text-canadian-blue" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="h-12 border-2 focus:border-canadian-blue transition-all duration-300 pr-12"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-canadian-blue hover:bg-canadian-blue-deep text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" key="signup-form">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <User className="w-3 h-3 text-canadian-red" />
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Username"
                              className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <Mail className="w-3 h-3 text-canadian-red" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                          <User className="w-3 h-3 text-canadian-red" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                            value={field.value || ''}
                            onChange={(e) => {
                              console.log('Full name onChange:', e.target.value);
                              field.onChange(e);
                            }}
                            onBlur={field.onBlur}
                            name="fullName"
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <Phone className="w-3 h-3 text-canadian-red" />
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone"
                              className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <Calendar className="w-3 h-3 text-canadian-red" />
                            Birth Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                          <MapPin className="w-3 h-3 text-canadian-red" />
                          Current Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Nairobi, Kenya"
                            className="h-10 border-2 focus:border-canadian-red transition-all duration-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="positionApplied"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                          <Briefcase className="w-3 h-3 text-canadian-red" />
                          Position Applied For
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 border-2 focus:border-canadian-red transition-all duration-300">
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobPositions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <Lock className="w-3 h-3 text-canadian-red" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="h-10 border-2 focus:border-canadian-red transition-all duration-300 pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                                ) : (
                                  <Eye className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-xs font-semibold">
                            <Lock className="w-3 h-3 text-canadian-red" />
                            Confirm
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm"
                                className="h-10 border-2 focus:border-canadian-red transition-all duration-300 pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                                ) : (
                                  <Eye className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-canadian-red hover:bg-canadian-red-deep text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-semibold text-canadian-red hover:text-canadian-red-deep"
                  onClick={handleModeToggle}
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthSystem;
