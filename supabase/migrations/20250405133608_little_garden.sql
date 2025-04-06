/*
  # Add RLS policies for patient management

  1. Changes
    - Add RLS policy for inserting new patients
    - Add RLS policy for updating patient records
    - Add RLS policy for deleting patient records

  2. Security
    - Only authenticated users can insert new patients
    - Only authenticated users can update patient records
    - Only authenticated users can delete patient records
    - Maintains existing public read access
*/

-- Policy to allow authenticated users to insert new patients
CREATE POLICY "Authenticated users can insert patients"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy to allow authenticated users to update patient records
CREATE POLICY "Authenticated users can update patients"
ON public.patients
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated users to delete patient records
CREATE POLICY "Authenticated users can delete patients"
ON public.patients
FOR DELETE
TO authenticated
USING (true);