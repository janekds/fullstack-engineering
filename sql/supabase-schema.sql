-- Supabase Database Schema for Durdle Recruitment Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    cv_url TEXT,
    interview_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT FALSE,
    type TEXT NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
    experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    transcript TEXT NOT NULL,
    audio_url TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'interview', 'offer', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample jobs data
INSERT INTO jobs (title, company, description, requirements, salary_min, salary_max, location, remote, type, experience_level) VALUES
('Expert Model Trainer', 'Anthropic', 'Join our team to train and fine-tune large language models. Work on cutting-edge AI research and help shape the future of conversational AI.', '{"PhD in ML/AI", "Experience with large-scale training", "Python/PyTorch expertise"}', 120, 180, 'San Francisco', true, 'full-time', 'senior'),
('Legal Intelligence Analyst', 'Harvey AI', 'Analyze legal documents and case law using AI tools. Help develop intelligent legal research systems for law firms.', '{"JD degree", "Legal research experience", "Data analysis skills"}', 80, 120, 'New York', true, 'full-time', 'mid'),
('Medical Intelligence Analyst', 'PathAI', 'Work with pathologists to improve diagnostic accuracy using machine learning. Analyze medical imaging data and develop AI-powered diagnostic tools.', '{"MD or PhD in Medical Sciences", "Machine learning experience", "Medical imaging knowledge"}', 110, 160, 'Boston', true, 'full-time', 'senior'),
('AI Research Scientist', 'OpenAI', 'Conduct research on artificial general intelligence (AGI) and contribute to the development of safe, beneficial AI systems.', '{"PhD in CS/ML", "Research publications", "Deep learning expertise"}', 150, 250, 'San Francisco', false, 'full-time', 'senior'),
('Machine Learning Engineer', 'Tesla', 'Develop and deploy machine learning models for autonomous driving systems. Work on computer vision and sensor fusion algorithms.', '{"MS in CS/Engineering", "ML/CV experience", "C++/Python proficiency"}', 140, 200, 'Austin', false, 'full-time', 'mid'),
('Data Scientist', 'Spotify', 'Analyze user behavior and music preferences to improve recommendation algorithms. Build predictive models for user engagement.', '{"MS in Statistics/Data Science", "Python/R expertise", "ML experience"}', 100, 140, 'Stockholm', true, 'full-time', 'mid'),
('Senior Software Engineer', 'Google', 'Design and implement scalable systems for Google Search. Work on improving search quality and performance.', '{"BS/MS in Computer Science", "5+ years experience", "Java/C++/Python"}', 150, 200, 'Mountain View', false, 'full-time', 'senior'),
('Product Manager', 'Meta', 'Lead product development for VR/AR experiences. Work with cross-functional teams to define product roadmaps.', '{"MBA or equivalent", "Product management experience", "VR/AR knowledge"}', 120, 180, 'Menlo Park', false, 'full-time', 'mid'),
('DevOps Engineer', 'Amazon', 'Build and maintain cloud infrastructure for AWS services. Automate deployment and monitoring systems.', '{"AWS certifications", "Docker/Kubernetes", "Infrastructure as Code"}', 110, 150, 'Seattle', true, 'full-time', 'mid'),
('UX Designer', 'Apple', 'Design intuitive user interfaces for iOS and macOS applications. Conduct user research and create design prototypes.', '{"Design portfolio", "Figma/Sketch expertise", "User research experience"}', 100, 140, 'Cupertino', false, 'full-time', 'mid');

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Interviews policies
CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE USING (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);

-- Jobs are public (read-only for all authenticated users)
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Storage policies for CV uploads
CREATE POLICY "Users can upload their own CVs" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own CVs" ON storage.objects FOR SELECT USING (
  bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own CVs" ON storage.objects FOR UPDATE USING (
  bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own CVs" ON storage.objects FOR DELETE USING (
  bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
);
