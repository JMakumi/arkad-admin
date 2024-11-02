import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
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
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isInactive, setIsInactive] = useState(false);
  const navigate = useNavigate();

  const handleLogin = useCallback((role, data) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(data);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const handleInactivity = () => setIsInactive(true);
      const resetInactivityTimer = () => setIsInactive(false);

      const activityEvents = ['click', 'mousemove', 'keydown'];
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
      
      const inactivityTimer = setTimeout(handleInactivity, 60000); // 60 seconds

      if (isInactive) handleLogout();

      return () => {
        clearTimeout(inactivityTimer);
        activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      };
    }
  }, [isAuthenticated, isInactive, handleLogout]);

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
            <Dashboard
              userRole={userRole}
              onLogout={handleLogout}
            />
          </aside>

          <main className="flex-1 p-6">
            <header className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl">Welcome to the Dashboard</h1>
              </div>
            </header>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {userRole === 'super-admin' && <Route path="/signup" element={<Signup />} />}
              {userRole === 'admin' || userRole === 'super-admin' ? (
                <Route path="*" element={<Navigate to="/home" />} />
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
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

export default App;
