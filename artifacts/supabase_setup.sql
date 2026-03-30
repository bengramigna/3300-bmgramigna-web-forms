-- Free Time Survey - Supabase Setup
-- Run this in the Supabase SQL Editor for project: lxfuabguoqxsmqbakbaf

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  gpa TEXT NOT NULL,
  state TEXT NOT NULL,
  sports TEXT[] NOT NULL,
  restaurants TEXT[] NOT NULL,
  other_restaurant TEXT
);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can submit a response)
CREATE POLICY "Allow public inserts"
  ON survey_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public reads (anyone can view aggregated results)
CREATE POLICY "Allow public reads"
  ON survey_responses
  FOR SELECT
  TO public
  USING (true);
