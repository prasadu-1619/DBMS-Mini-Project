/*
  # Fix RLS policies for patients table

  1. Changes
    - Drop existing policies that might conflict
    - Create new, properly scoped RLS policies for the patients table
    
  2. Security
    - Enable RLS (already enabled)
    - Add properly scoped policies for CRUD operations
    - Ensure authenticated users can perform necessary operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can delete patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can insert patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;
DROP POLICY IF EXISTS "Public read access for patients" ON patients;

-- Create new policies with proper security scoping
CREATE POLICY "Enable read access for authenticated users"
ON public.patients
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.patients
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON public.patients
FOR DELETE
TO authenticated
USING (true);