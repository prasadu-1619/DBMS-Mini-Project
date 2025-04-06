/*
  # Fix RLS policies for patients table

  1. Security Changes
    - Update RLS policies for patients table to allow public access for inserts
    - Keep existing policies for authenticated users
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON patients;

-- Create new insert policy that allows public access
CREATE POLICY "Enable public insert access for patients"
  ON patients
  FOR INSERT
  TO public
  WITH CHECK (true);