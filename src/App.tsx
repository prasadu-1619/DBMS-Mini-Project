import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Stethoscope, User, Beaker, Home, Menu, X, UserCircle } from 'lucide-react';
import PatientRegistration from './components/PatientRegistration';
import DoctorDashboard from './components/DoctorDashboard';
import LabDashboard from './components/LabDashboard';
import PatientDashboard from './components/PatientDashboard';

// NavLink component for active styling
const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive 
          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-md" 
          : "text-gray-100 hover:bg-teal-800 hover:text-white"
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-300"}`} />
      <span className="ml-3 font-medium">{children}</span>
    </Link>
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-sans">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg border-b border-teal-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center group">
                  <div className="bg-teal-500 p-2 rounded-full transition-all duration-300 group-hover:bg-teal-400">
                    <Stethoscope className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-3">
                    <span className="text-xl font-bold text-white tracking-tight">
                      MediCare
                    </span>
                    <span className="ml-2 text-sm font-medium text-teal-400 hidden sm:block tracking-wide">
                      Hospital Management System
                    </span>
                  </div>
                </Link>
              </div>
              
              {/* Desktop nav */}
              <div className="hidden md:flex md:items-center md:space-x-3">
                <NavLink to="/" icon={Home}>
                  Reception
                </NavLink>
                <NavLink to="/doctor" icon={User}>
                  Doctor
                </NavLink>
                <NavLink to="/lab" icon={Beaker}>
                  Laboratory
                </NavLink>
                <NavLink to="/patient" icon={UserCircle}>
                  Patient
                </NavLink>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-teal-700 focus:outline-none transition-colors duration-300"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-800 border-b border-teal-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-teal-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="mr-3 h-5 w-5 text-teal-400" />
                  Reception
                </Link>
                <Link
                  to="/doctor"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-teal-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-3 h-5 w-5 text-teal-400" />
                  Doctor
                </Link>
                <Link
                  to="/lab"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-teal-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Beaker className="mr-3 h-5 w-5 text-teal-400" />
                  Laboratory
                </Link>
                <Link
                  to="/patient"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-teal-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCircle className="mr-3 h-5 w-5 text-teal-400" />
                  Patient
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-teal-500/10">
            <Routes>
              <Route path="/" element={<PatientRegistration />} />
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/lab" element={<LabDashboard />} />
              <Route path="/patient" element={<PatientDashboard />} />
            </Routes>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 mt-8 py-4 border-t border-teal-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400">
              © 2025 MediCare Hospital Management System. All rights reserved.
            </p>
            <div className="flex justify-center mt-3 space-x-6">
              <div className="h-1 w-12 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-teal-300 to-teal-200 rounded-full"></div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;