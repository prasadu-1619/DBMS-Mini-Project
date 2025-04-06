import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, User, Edit, Save, X, TestTube } from 'lucide-react';
function PatientDashboard() {
  const [patientNumber, setPatientNumber] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [previousPrescriptions, setPreviousPrescriptions] = useState<any[]>([]);
  const [labReports, setLabReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedPatientData, setUpdatedPatientData] = useState<any>(null);

  const searchPatient = async () => {
    if (!patientNumber.trim()) {
      alert('Please enter your patient number');
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
      setUpdatedPatientData(data[0]);
      
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
    setLoading(true);
    try {
      // Fetch previous prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select(`
          id,
          diagnosis,
          prescription_text,
          visit_date,
          created_at,
          doctors (
            id,
            full_name,
            specialization
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
      setLoading(false);
    }
  };

  const handleUpdatePatient = async () => {
    if (!patientData || !updatedPatientData) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          full_name: updatedPatientData.full_name,
          contact_number: updatedPatientData.contact_number,
          address: updatedPatientData.address
        })
        .eq('id', patientData.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      setPatientData(updatedPatientData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleInputChange = (field: string, value: string) => {
    setUpdatedPatientData({
      ...updatedPatientData,
      [field]: value
    });
  };

  const cancelEdit = () => {
    setUpdatedPatientData(patientData);
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <User className="mr-2 text-teal-400" /> Patient Portal
      </h2>

      {!patientData && (
        <div className="mb-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
          <h3 className="text-xl font-medium mb-4 text-teal-300">Access Your Medical Records</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter Your Patient Number (e.g., HMS-2025-12345)"
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
              {loading ? 'Searching...' : 'Access Records'}
            </button>
          </div>
        </div>
      )}

      {patientData && (
        <div className="space-y-6">
          {/* Patient Information Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-teal-300 flex items-center">
                <User className="mr-2" /> Personal Information
              </h3>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center px-3 py-1 text-sm bg-teal-700 text-white rounded hover:bg-teal-600 transition-colors duration-300"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={cancelEdit}
                    className="flex items-center px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-300"
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </button>
                  <button 
                    onClick={handleUpdatePatient}
                    disabled={loading}
                    className="flex items-center px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-500 transition-colors duration-300"
                  >
                    <Save className="w-4 h-4 mr-1" /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedPatientData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white">{patientData.full_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                  <p className="text-white">{new Date(patientData.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                  <p className="text-white">{patientData.gender}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patient Number</label>
                  <p className="text-white">{patientData.patient_number}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedPatientData.contact_number}
                      onChange={(e) => handleInputChange('contact_number', e.target.value)}
                      className="w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white">{patientData.contact_number}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedPatientData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white">{patientData.address}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-sm text-gray-400">Registration Date: {formatDate(patientData.registration_date)}</p>
            </div>
          </div>

          {/* Medical Records Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prescriptions Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30 h-full">
              <h3 className="text-xl font-medium text-teal-300 mb-4 flex items-center">
                <FileText className="mr-2" /> Prescriptions
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-teal-500">Loading prescriptions...</div>
                </div>
              ) : previousPrescriptions.length > 0 ? (
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
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
                        Dr. {prescription.doctors?.full_name} ({prescription.doctors?.specialization})
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <FileText className="h-12 w-12 mb-2 opacity-50" />
                  <p>No prescriptions available</p>
                </div>
              )}
            </div>

            {/* Lab Reports Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30 h-full">
              <h3 className="text-xl font-medium text-teal-300 mb-4 flex items-center">
                <TestTube className="mr-2" /> Lab Reports
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-teal-500">Loading lab reports...</div>
                </div>
              ) : labReports.length > 0 ? (
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
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
                  <Flask className="h-12 w-12 mb-2 opacity-50" />
                  <p>No lab reports available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;