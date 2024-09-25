import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import {
  FaTasks,
  FaImages,
  FaHandsHelping,
  FaDonate,
  FaEnvelope,
  FaUserFriends,
  FaHandshake,
  FaNewspaper,
  FaCogs,
  FaUserTie,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
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
import logo from './images/logo.png';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [leadershipOpen, setLeadershipOpen] = useState(false);
  const [achievementsOpen, setAchieveentsOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
  };

  const detectDesktopMode = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isDesktopViewport = window.innerWidth >= 1024;
    setIsDesktop(!isMobile || isDesktopViewport);
  };

  const toggleDropdown = (setDropdownState, dropdownState) => {
    setDropdownState(!dropdownState);
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedAccessToken && storedUserData) {
      setIsAuthenticated(true);
    }

    detectDesktopMode();

    const handleResize = () => {
      detectDesktopMode();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center p-4">
        <h1 className="text-xl">
          This application is best viewed on a desktop. Please switch to desktop mode to continue.
        </h1>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <div className="flex min-h-screen bg-white text-gray-900">
          {isAuthenticated ? (
            <>
              {/* Sidebar */}
              <aside className="bg-[#006D5B] text-white w-64 min-h-screen p-4 sm:w-20 md:w-64">
                <div className="flex flex-col items-center">
                  <img
                    src={logo}
                    alt="Organization Logo"
                    className="h-20 mb-8 w-auto sm:h-12 sm:mb-4"
                  />
                  <nav className="flex flex-col space-y-4">
                    
                    {/* Achievements Dropdown */}
                    <div>
                      <div
                        onClick={() => toggleDropdown(setAchieveentsOpen, achievementsOpen)}
                        className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 cursor-pointer hover:text-[#FFD700]"
                      >
                        <FaTasks className="text-xl" />
                        <span className="hidden md:inline">Achievements</span>
                        {achievementsOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      {achievementsOpen && (
                        <div className="pl-8">
                          <Link to="/achievements" className="block py-2 hover:text-[#FFD700]">Add Achievements</Link>
                          <Link to="/manage-achievements" className="block py-2 hover:text-[#FFD700]">Manage Achievements</Link>
                        </div>
                      )}
                    </div>

                    {/* Activities Dropdown */}
                    <div>
                      <div
                        onClick={() => toggleDropdown(setActivitiesOpen, activitiesOpen)}
                        className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 cursor-pointer hover:text-[#FFD700]"
                      >
                        <FaTasks className="text-xl" />
                        <span className="hidden md:inline">Activities</span>
                        {activitiesOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      {activitiesOpen && (
                        <div className="pl-8">
                          <Link to="/activities" className="block py-2 hover:text-[#FFD700]">Add Activities</Link>
                          <Link to="/manage-activities" className="block py-2 hover:text-[#FFD700]">Manage Activities</Link>
                        </div>
                      )}
                    </div>

                    {/* Media Dropdown */}
                    <div>
                      <div
                        onClick={() => toggleDropdown(setMediaOpen, mediaOpen)}
                        className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 cursor-pointer hover:text-[#FFD700]"
                      >
                        <FaImages className="text-xl" />
                        <span className="hidden md:inline">Media</span>
                        {mediaOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      {mediaOpen && (
                        <div className="pl-8">
                          <Link to="/media" className="block py-2 hover:text-[#FFD700]">Add Media</Link>
                          <Link to="/manage-media" className="block py-2 hover:text-[#FFD700]">Manage Media</Link>
                        </div>
                      )}
                    </div>

                    {/* Membership Dropdown */}
                    <div>
                      <div
                        onClick={() => toggleDropdown(setMembershipOpen, membershipOpen)}
                        className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 cursor-pointer hover:text-[#FFD700]"
                      >
                        <FaUserFriends className="text-xl" />
                        <span className="hidden md:inline">Membership</span>
                        {membershipOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      {membershipOpen && (
                        <div className="pl-8">
                          <Link to="/members" className="block py-2 hover:text-[#FFD700]">Members</Link>
                          <Link to="/membership" className="block py-2 hover:text-[#FFD700]">Membership Requests</Link>
                          <Link to="/signup" className="block py-2 hover:text-[#FFD700]">Create New User</Link>
                        </div>
                      )}
                    </div>

                    {/* Leadership Dropdown */}
                    <div>
                      <div
                        onClick={() => toggleDropdown(setLeadershipOpen, leadershipOpen)}
                        className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 cursor-pointer hover:text-[#FFD700]"
                      >
                        <FaUserTie className="text-xl" />
                        <span className="hidden md:inline">Leadership</span>
                        {leadershipOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      {leadershipOpen && (
                        <div className="pl-8">
                          <Link to="/leadership" className="block py-2 hover:text-[#FFD700]">Add Leader</Link>
                          <Link to="/manage-leadership" className="block py-2 hover:text-[#FFD700]">Manage Leaders</Link>
                        </div>
                      )}
                    </div>

                    {/* Other Links */}
                    <Link to="/volunteer" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaHandsHelping className="text-xl" />
                      <span className="hidden md:inline">Volunteer</span>
                    </Link>
                    <Link to="/donation" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaDonate className="text-xl" />
                      <span className="hidden md:inline">Donation</span>
                    </Link>
                    <Link to="/partners" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaHandshake className="text-xl" />
                      <span className="hidden md:inline">Partners</span>
                    </Link>
                    <Link to="/newsletter" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaNewspaper className="text-xl" />
                      <span className="hidden md:inline">Newsletter</span>
                    </Link>
                    <Link to="/contact-us" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaEnvelope className="text-xl" />
                      <span className="hidden md:inline">Contact Us</span>
                    </Link>
                    <Link to="/change-password" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaCogs className="text-xl" />
                      <span className="hidden md:inline">Change Password</span>
                    </Link>
                    <button onClick={handleLogout} className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-800">
                      Logout
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/working" element={<Home />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/manage-achievements" element={<ManageAchievements />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/manage-activities" element={<ManageActivities />} />
                  <Route path="/media" element={<Media />} />
                  <Route path="/manage-media" element={<ManageMedia />} />
                  <Route path="/volunteer" element={<Volunteer />} />
                  <Route path="/donation" element={<Donations />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/leadership" element={<Leadership />} />
                  <Route path="/manage-leadership" element={<ManageLeadership />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                </Routes>
              </main>
            </>
          ) : (
            <div className="flex flex-1 flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
