import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Clipboard, Check } from 'lucide-react';

function PatientRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
  });
  const [patientNumber, setPatientNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a unique patient number (HMS-YYYY-XXXXX)
      const patientNumber = `HMS-${new Date().getFullYear()}-${Math.random().toString().slice(2, 7)}`;

      const { error } = await supabase.from('patients').insert({
        patient_number: patientNumber,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        contact_number: formData.contactNumber,
        address: formData.address,
      });

      if (error) throw error;

      setPatientNumber(patientNumber);
      setFormData({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        address: '',
      });
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Error registering patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <User className="mr-2 text-teal-400" /> Patient Registration
      </h2>

      {patientNumber && (
        <div className="mb-6 p-4 bg-teal-900/40 rounded-xl border border-teal-600/30">
          <div className="flex items-center">
            <Check className="text-teal-400 mr-2" />
            <p className="text-teal-300">
              Registration successful! Patient Number: <strong>{patientNumber}</strong>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-teal-700/30 space-y-6">
        <h3 className="text-xl font-medium mb-4 text-teal-300 flex items-center">
          <Clipboard className="mr-2" /> Registration Form
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="" className="bg-gray-700">Select Gender</option>
            <option value="male" className="bg-gray-700">Male</option>
            <option value="female" className="bg-gray-700">Female</option>
            <option value="other" className="bg-gray-700">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
          <input
            type="tel"
            required
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
          <textarea
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors duration-300"
        >
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
}

export default PatientRegistration;