/*
  # Hospital Management System Schema

  1. New Tables
    - `patients`
      - Basic patient information and registration details
    - `doctors`
      - Doctor information and specialization
    - `prescriptions`
      - Prescriptions given by doctors to patients
    - `lab_reports`
      - Laboratory test reports for patients

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  diagnosis TEXT NOT NULL,
  prescription_text TEXT NOT NULL,
  visit_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create lab_reports table
CREATE TABLE IF NOT EXISTS lab_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  test_name TEXT NOT NULL,
  test_result TEXT NOT NULL,
  test_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for patients" ON patients
  FOR SELECT USING (true);

CREATE POLICY "Public read access for doctors" ON doctors
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can read prescriptions" ON prescriptions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can read lab reports" ON lab_reports
  FOR SELECT USING (true);

-- Insert some sample doctors
INSERT INTO doctors (full_name, specialization) VALUES
  ('Dr. John Smith', 'General Medicine'),
  ('Dr. Sarah Johnson', 'Cardiology'),
  ('Dr. Michael Brown', 'Orthopedics')
ON CONFLICT DO NOTHING;