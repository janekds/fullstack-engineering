-- Create sales_inquiries table for hire experts form submissions
CREATE TABLE IF NOT EXISTS sales_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'lost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy to allow reading for authenticated users (for sales team)
ALTER TABLE sales_inquiries ENABLE ROW LEVEL SECURITY;

-- Sales team can view all inquiries
CREATE POLICY "Sales team can view all inquiries" ON sales_inquiries FOR SELECT USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_sales_inquiries_updated_at 
    BEFORE UPDATE ON sales_inquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
