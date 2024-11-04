import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Achievements from './Achievements';
import Activities from './Activities';
import Media from './Media';
import Volunteer from './Volunteer';
import Donations from './Donation';
import Membership from './Membership';
import Members from './Members';
import Partners from './Partners';
import ContactUs from './ContactUs';
import Newsletter from './Newsletter';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import ManageAchievements from './ManageAchievements';
import ManageActivities from './ManageActivities';
import ManageMedia from './ManageMedia';
import Leadership from './Leadership';
import ManageLeadership from './ManageLeadership';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import Dashboard from './Dashboard'; 
import UserManagement from './Users';
import './App.css';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isInactive, setIsInactive] = useState(false);
  const navigate = useNavigate();

  // Function to handle login and immediately update access control
  const handleLogin = useCallback((role, data) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(data);
  }, []);

  // Log out and reset states
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/login');
  }, [navigate]);

  // Update states if access token is already available in local storage on page load
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (storedAccessToken && storedUserData) {
      setIsAuthenticated(true);
      setUserRole(storedUserData.role);
      setUserData(storedUserData);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? (
        <div className="flex flex-1 bg-white text-gray-900">
          <aside className="bg-[#006D5B] text-white w-64 p-4">
            <Dashboard userRole={userRole} onLogout={handleLogout} />
          </aside>

          <main className="flex-1 p-6">
            <header className="flex justify-between items-center mb-4">
              <h1 className="text-2xl">Welcome to the Dashboard</h1>
            </header>
            {/* Pass userRole and isAuthenticated to the Routes component */}
            <AuthRoutes userRole={userRole} isAuthenticated={isAuthenticated} />
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
};

// A separate component for routes that can dynamically check for userRole and isAuthenticated
const AuthRoutes = ({ userRole, isAuthenticated }) => (
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/achievements" element={<Achievements />} />
    <Route path="/manage-achievements" element={<ManageAchievements />} />
    <Route path="/activities" element={<Activities />} />
    <Route path="/manage-activities" element={<ManageActivities />} />
    <Route path="/media" element={<Media />} />
    <Route path="/manage-media" element={<ManageMedia />} />
    <Route path="/volunteer" element={<Volunteer />} />
    <Route path="/donation" element={<Donations />} />
    <Route path="/leadership" element={<Leadership />} />
    <Route path="/manage-leadership" element={<ManageLeadership />} />
    <Route path="/membership" element={<Membership />} />
    <Route path="/members" element={<Members />} />
    <Route path="/partners" element={<Partners />} />
    <Route path="/newsletter" element={<Newsletter />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/change-password" element={<ChangePassword />} />
    
    {/* Role-based access control for admin-only and super-admin-only routes */}
    {userRole === 'super-admin' && <Route path="/signup" element={<Signup />} />}
    {userRole === 'super-admin' && <Route path="/remove-user" element={<UserManagement />} />}
    
    {/* Redirect based on authentication and role */}
    <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
  </Routes>
);

export default App;

