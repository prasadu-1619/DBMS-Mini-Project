import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, User, Stethoscope, Beaker } from 'lucide-react';

function DoctorDashboard() {
  const [patientNumber, setPatientNumber] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    prescription: '',
    doctorId: '',
  });
  const [previousPrescriptions, setPreviousPrescriptions] = useState<any[]>([]);
  const [labReports, setLabReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors when component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization')
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
      
      // Set default doctor if available
      if (data && data.length > 0) {
        setPrescriptionData(prev => ({ ...prev, doctorId: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Error loading doctors list');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const searchPatient = async () => {
    if (!patientNumber.trim()) {
      alert('Please enter a patient number');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_number', patientNumber.trim())
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        setPatientData(null);
        alert('Patient not found');
        return;
      }

      setPatientData(data[0]);
      
      // After finding the patient, load their history
      await fetchPatientHistory(data[0].id);
      
    } catch (error) {
      console.error('Error searching patient:', error);
      alert('Error searching patient');
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async (patientId: string) => {
    setLoadingHistory(true);
    try {
      // Fetch previous prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select(`
          id,
          diagnosis,
          prescription_text,
          created_at,
          doctors (
            id,
            full_name
          )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (prescriptionsError) throw prescriptionsError;
      setPreviousPrescriptions(prescriptionsData || []);

      // Fetch lab reports
      const { data: labReportsData, error: labReportsError } = await supabase
        .from('lab_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('test_date', { ascending: false });

      if (labReportsError) throw labReportsError;
      setLabReports(labReportsData || []);
    } catch (error) {
      console.error('Error fetching patient history:', error);
      alert('Error loading patient history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData || !prescriptionData.doctorId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('prescriptions').insert({
        patient_id: patientData.id,
        doctor_id: prescriptionData.doctorId,
        diagnosis: prescriptionData.diagnosis,
        prescription_text: prescriptionData.prescription,
      });

      if (error) throw error;

      alert('Prescription saved successfully!');
      
      // Refresh the prescription history
      await fetchPatientHistory(patientData.id);
      
      // Reset the form fields except doctor selection
      setPrescriptionData(prev => ({ 
        ...prev,
        diagnosis: '', 
        prescription: '' 
      }));
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Error saving prescription');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <Stethoscope className="mr-2 text-teal-400" /> Doctor's Dashboard
      </h2>

      <div className="mb-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
        <h3 className="text-xl font-medium mb-4 text-teal-300">Patient Search</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter Patient Number (e.g., HMS-2025-12345)"
            value={patientNumber}
            onChange={(e) => setPatientNumber(e.target.value)}
            className="flex-1 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
            disabled={loading}
          />
          <button
            onClick={searchPatient}
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {patientData && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
            <h3 className="text-xl font-medium mb-4 text-teal-300 flex items-center">
              <User className="mr-2" /> Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <p className="text-white">{patientData.full_name}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                  <p className="text-white">{new Date(patientData.date_of_birth).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                  <p className="text-white">{patientData.gender}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patient Number</label>
                  <p className="text-white">{patientData.patient_number}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lab Reports Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30 h-full">
              <h3 className="text-xl font-medium text-teal-300 mb-4 flex items-center">
                <Beaker className="mr-2" /> Lab Reports
              </h3>
              
              {loadingHistory ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-teal-500">Loading lab reports...</div>
                </div>
              ) : labReports.length > 0 ? (
                <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                  {labReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-teal-600 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-medium">{report.test_name}</p>
                        <span className="text-sm text-gray-400">{formatDate(report.test_date)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-300">Result: </span>
                        <span className="text-white font-medium">{report.test_result}</span>
                      </div>
                      {report.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <p className="text-sm text-gray-300 whitespace-pre-line">{report.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Beaker className="h-12 w-12 mb-2 opacity-50" />
                  <p>No lab reports available</p>
                </div>
              )}
            </div>

            {/* Previous Prescriptions Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30 h-full">
              <h3 className="text-xl font-medium text-teal-300 mb-4 flex items-center">
                <FileText className="mr-2" /> Previous Prescriptions
              </h3>
              
              {loadingHistory ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-teal-500">Loading prescription history...</div>
                </div>
              ) : previousPrescriptions.length > 0 ? (
                <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                  {previousPrescriptions.map((prescription) => (
                    <div 
                      key={prescription.id} 
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-teal-600 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-medium">{prescription.diagnosis}</p>
                        <span className="text-sm text-gray-400">{formatDate(prescription.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 whitespace-pre-line">{prescription.prescription_text}</p>
                      <div className="text-sm text-teal-400">
                        Dr. {prescription.doctors?.full_name || 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <FileText className="h-12 w-12 mb-2 opacity-50" />
                  <p>No previous prescriptions</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
            <h3 className="text-xl font-medium mb-4 text-teal-300 flex items-center">
              <FileText className="mr-2" /> New Prescription
            </h3>

            <div className="space-y-4">
              {/* Doctor Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Attending Doctor</label>
                <div className="relative">
                  {loadingDoctors ? (
                    <div className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-gray-400">
                      Loading doctors...
                    </div>
                  ) : (
                    <select
                      required
                      value={prescriptionData.doctorId}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, doctorId: e.target.value })}
                      className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2"
                    >
                      <option value="" className="bg-gray-700">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id} className="bg-gray-700">
                          Dr. {doctor.full_name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Diagnosis</label>
                <textarea
                  required
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Prescription</label>
                <textarea
                  required
                  value={prescriptionData.prescription}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, prescription: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prescriptionData.doctorId}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors duration-300"
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;