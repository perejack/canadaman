-- Create applications table for job application data
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Personal Details
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  nationality TEXT DEFAULT 'Kenyan',
  id_number TEXT,
  
  -- Address Information
  county TEXT,
  city TEXT,
  address TEXT,
  
  -- Education Background
  education_level TEXT CHECK (education_level IN ('primary', 'secondary', 'certificate', 'diploma', 'bachelor', 'master', 'phd')),
  institution_name TEXT,
  course_study TEXT,
  graduation_year INTEGER,
  
  -- Work Experience
  years_experience INTEGER DEFAULT 0,
  current_position TEXT,
  previous_employer TEXT,
  
  -- Application Details
  position_applied TEXT NOT NULL,
  cover_letter TEXT,
  skills TEXT[],
  languages TEXT[],
  
  -- Additional Information
  references JSONB,
  certifications TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but allow public access for applications)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications (no login required)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading applications (for admin purposes later)
CREATE POLICY "Anyone can view applications" 
ON public.applications 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on common queries
CREATE INDEX idx_applications_position ON public.applications(position_applied);
CREATE INDEX idx_applications_email ON public.applications(email);
CREATE INDEX idx_applications_created_at ON public.applications(created_at);