-- Canada Jobs Portal - Supabase Database Schema
-- Execute these SQL commands in your Supabase SQL Editor
-- Note: JWT secret is automatically managed by Supabase

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(100),
    date_of_birth DATE,
    position_applied VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    description TEXT,
    industry VARCHAR(50),
    location VARCHAR(100),
    website VARCHAR(255),
    hiring_positions TEXT[], -- Array of positions they're hiring for
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Job Offers table
CREATE TABLE IF NOT EXISTS job_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    position VARCHAR(100) NOT NULL,
    salary_range VARCHAR(50),
    job_type VARCHAR(20) DEFAULT 'Full-time', -- Full-time, Part-time
    description TEXT,
    requirements TEXT[],
    benefits TEXT[],
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
    offer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Interview Requests table
CREATE TABLE IF NOT EXISTS interview_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    position VARCHAR(100) NOT NULL,
    interview_type VARCHAR(20) DEFAULT 'video', -- video, phone, in-person
    status VARCHAR(20) DEFAULT 'pending', -- pending, scheduled, completed, cancelled
    message TEXT,
    proposed_dates JSONB, -- Array of proposed interview dates
    scheduled_date TIMESTAMP WITH TIME ZONE,
    interview_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Messages table (Inbox system)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(30) DEFAULT 'general', -- general, interview_request, job_offer, welcome
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'normal', -- high, normal, low
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL, -- interview_request, job_offer, message, system
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create User Activity Log
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- login, profile_update, message_read, etc.
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample companies
INSERT INTO companies (name, logo_url, description, industry, location, hiring_positions) VALUES
('Tim Hortons', '/images/companies/tim-hortons.jpg', 'Canada''s iconic coffee chain offering great career opportunities with competitive benefits and growth potential.', 'Food & Beverage', 'Toronto, ON', ARRAY['Barista', 'Kitchen Helper', 'Cashier', 'Manager']),
('Marriott Hotels', '/images/companies/marriott.jpg', 'Leading hospitality company providing exceptional career opportunities in luxury hotel management and services.', 'Hospitality', 'Vancouver, BC', ARRAY['Hotel Front Desk Clerk', 'Housekeeper', 'Concierge', 'Manager']),
('Home Depot Canada', '/images/companies/home-depot.jpg', 'North America''s largest home improvement retailer offering diverse career paths and excellent employee benefits.', 'Retail', 'Calgary, AB', ARRAY['Sales Associate', 'Cashier', 'Warehouse Worker', 'Manager']),
('Four Seasons Hotels', '/images/companies/four-seasons.jpg', 'Luxury hotel chain renowned for exceptional service and providing world-class career opportunities.', 'Hospitality', 'Toronto, ON', ARRAY['Concierge', 'Housekeeper', 'Chef', 'Manager']),
('Boston Pizza', '/images/companies/boston-pizza.jpg', 'Canada''s favorite restaurant offering exciting career opportunities in a fun, team-oriented environment.', 'Food & Beverage', 'Edmonton, AB', ARRAY['Server', 'Cook', 'Host', 'Manager']),
('Canadian Tire', '/images/companies/canadian-tire.jpg', 'Iconic Canadian retailer providing diverse career opportunities across multiple business segments.', 'Retail', 'Ottawa, ON', ARRAY['Sales Associate', 'Mechanic', 'Cashier', 'Manager']);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_position ON users(position_applied);
CREATE INDEX idx_messages_user_unread ON messages(user_id, is_read);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_interview_requests_user ON interview_requests(user_id, status);
CREATE INDEX idx_job_offers_user ON job_offers(user_id, status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own interview requests" ON interview_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own interview requests" ON interview_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own job offers" ON job_offers FOR SELECT USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_requests_updated_at BEFORE UPDATE ON interview_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create sample data for a user (call after user registration)
CREATE OR REPLACE FUNCTION create_sample_user_data(user_uuid UUID, user_position VARCHAR)
RETURNS VOID AS $$
DECLARE
    company_record RECORD;
    message_count INTEGER := 0;
BEGIN
    -- Create interview requests from 2 companies
    FOR company_record IN 
        SELECT id, name FROM companies 
        WHERE user_position = ANY(hiring_positions) 
        LIMIT 2
    LOOP
        -- Insert interview request
        INSERT INTO interview_requests (user_id, company_id, position, message, proposed_dates)
        VALUES (
            user_uuid,
            company_record.id,
            user_position,
            'We have reviewed your application and are impressed with your qualifications. We would like to invite you for an interview.',
            '["2024-01-15T10:00:00Z", "2024-01-16T14:00:00Z", "2024-01-17T11:00:00Z"]'::jsonb
        );
        
        -- Insert welcome message
        INSERT INTO messages (user_id, company_id, subject, content, message_type, priority)
        VALUES (
            user_uuid,
            company_record.id,
            'Congratulations! Interview Invitation for ' || user_position,
            'Dear Candidate,

We are thrilled to inform you that after carefully reviewing your application for the ' || user_position || ' position, we have been impressed by your qualifications and experience.

We would like to invite you to participate in an interview process. This is an excellent opportunity for us to get to know you better and for you to learn more about our company culture and the exciting opportunities we offer.

Our team is excited about the possibility of having you join our organization. We believe your skills and background align perfectly with what we are looking for.

Please click the "Book Interview" button below to schedule your interview at your convenience.

We look forward to meeting you soon!

Best regards,
' || company_record.name || ' Hiring Team',
            'interview_request',
            'high'
        );
        
        -- Insert notification
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            user_uuid,
            'New Interview Request!',
            company_record.name || ' wants to interview you for ' || user_position,
            'interview_request'
        );
        
        message_count := message_count + 1;
    END LOOP;
    
    -- Create job offers from other companies
    FOR company_record IN 
        SELECT id, name FROM companies 
        WHERE user_position = ANY(hiring_positions) 
        LIMIT 3 OFFSET 2
    LOOP
        INSERT INTO job_offers (user_id, company_id, position, salary_range, description, benefits)
        VALUES (
            user_uuid,
            company_record.id,
            user_position,
            '$45,000 - $65,000 CAD',
            'Exciting opportunity to join our dynamic team in a ' || user_position || ' role with excellent growth prospects.',
            ARRAY['Health Insurance', 'Dental Coverage', 'Paid Vacation', 'Career Development', 'Immigration Support']
        );
        
        -- Insert job offer notification
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            user_uuid,
            'New Job Offer Available!',
            company_record.name || ' has a ' || user_position || ' position available for you',
            'job_offer'
        );
    END LOOP;
    
    -- Insert welcome notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        user_uuid,
        'Welcome to Canada Jobs Portal! 🇨🇦',
        'Your profile has been successfully created. Companies are already showing interest in your application!',
        'system'
    );
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion function (run this after creating a user)
-- SELECT create_sample_user_data('user-uuid-here', 'Chef');
