-- payment_attempts table for Applications DB
-- Run this in your Applications Supabase SQL Editor (https://mybxocmjqnslolexzuam.supabase.co)

CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    interview_booking_id UUID REFERENCES interview_bookings(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('application', 'interview_booking', 'unknown')),
    checkout_request_id TEXT NOT NULL,
    phone_number TEXT,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_payment_attempts_checkout_request_id ON payment_attempts(checkout_request_id);
CREATE INDEX idx_payment_attempts_application_id ON payment_attempts(application_id);
CREATE INDEX idx_payment_attempts_user_id ON payment_attempts(user_id);
CREATE INDEX idx_payment_attempts_status ON payment_attempts(status);

-- Optional: Enable RLS if you want row-level security
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust as needed)
-- Allow service role to do anything (for backend inserts/updates)
CREATE POLICY "Service role full access" ON payment_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own attempts
CREATE POLICY "Users can view own attempts" ON payment_attempts
    FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_payment_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER payment_attempts_updated_at
    BEFORE UPDATE ON payment_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_attempts_updated_at();
