import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Beaker, User, Search, FileText } from 'lucide-react';

function LabDashboard() {
  const [patientNumber, setPatientNumber] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  const [reportData, setReportData] = useState({
    testName: '',
    testResult: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error('Error searching patient:', error);
      alert('Error searching patient');
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('lab_reports').insert({
        patient_id: patientData.id,
        test_name: reportData.testName,
        test_result: reportData.testResult,
        notes: reportData.notes,
        test_date: new Date().toISOString(),
      });

      if (error) throw error;

      alert('Lab report saved successfully!');
      setReportData({ testName: '', testResult: '', notes: '' });
    } catch (error) {
      console.error('Error saving lab report:', error);
      alert('Error saving lab report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <Beaker className="mr-2 text-teal-400" /> Laboratory Dashboard
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

          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30">
            <h3 className="text-xl font-medium mb-4 text-teal-300 flex items-center">
              <FileText className="mr-2" /> New Lab Report
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  value={reportData.testName}
                  onChange={(e) => setReportData({ ...reportData, testName: e.target.value })}
                  className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Test Result</label>
                <textarea
                  required
                  value={reportData.testResult}
                  onChange={(e) => setReportData({ ...reportData, testResult: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
                <textarea
                  value={reportData.notes}
                  onChange={(e) => setReportData({ ...reportData, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors duration-300"
              >
                {loading ? 'Saving...' : 'Save Lab Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default LabDashboard;