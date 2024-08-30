import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaTrophy, FaTasks, FaImages, FaHandsHelping, FaDonate, FaUserFriends, FaHandshake, FaNewspaper, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
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
import logo from './images/logo.png';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // 1024px is the typical breakpoint for desktop
    };

    handleResize(); // Check on mount
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
      <div className={darkMode ? "dark" : ""}>
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          {isAuthenticated ? (
            <>
              {/* Sidebar */}
              <aside className={`bg-${darkMode ? 'gray-900' : '[#006D5B]'} text-white w-64 min-h-screen p-4 sm:w-20 md:w-64`}>
                <div className="flex flex-col items-center">
                  <img
                    src={logo}
                    alt="Organization Logo"
                    className="h-20 mb-8 w-auto sm:h-12 sm:mb-4"
                  />
                  <nav className="flex flex-col space-y-4">
                    <Link to="/achievements" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaTrophy className="text-xl" />
                      <span className="hidden md:inline">Achievements</span>
                    </Link>
                    <Link to="/activities" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaTasks className="text-xl" />
                      <span className="hidden md:inline">Activities</span>
                    </Link>
                    <Link to="/media" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaImages className="text-xl" />
                      <span className="hidden md:inline">Media</span>
                    </Link>
                    <Link to="/volunteer" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaHandsHelping className="text-xl" />
                      <span className="hidden md:inline">Volunteer</span>
                    </Link>
                    <Link to="/donation" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaDonate className="text-xl" />
                      <span className="hidden md:inline">Donation</span>
                    </Link>
                    <Link to="/membership" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaUserFriends className="text-xl" />
                      <span className="hidden md:inline">Membership</span>
                    </Link>
                    <Link to="/members" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaUserFriends className="text-xl" />
                      <span className="hidden md:inline">Arkad Family</span>
                    </Link>
                    <Link to="/partnership-request" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaHandshake className="text-xl" />
                      <span className="hidden md:inline">Partnership</span>
                    </Link>
                    <Link to="/messages" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaEnvelope className="text-xl" />
                      <span className="hidden md:inline">Messages</span>
                    </Link>
                    <Link to="/newsletter" className="flex items-center justify-center sm:justify-center md:justify-start space-x-2 hover:text-[#FFD700]">
                      <FaNewspaper className="text-xl" />
                      <span className="hidden md:inline">Newsletter</span>
                    </Link>
                    <button onClick={toggleDarkMode} className="mt-8 px-4 py-2 rounded hover:bg-opacity-70 flex items-center justify-center">
                      {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-500" />}
                      <span className="ml-2 hidden md:inline">
                        {darkMode ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                    <button onClick={handleLogout} className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-800">
                      Logout
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 p-8">
                <Routes>
                  <Route path="/working" element={<Home />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path='/activities' element={<Activities />} />
                  <Route path='/media' element={<Media />} />
                  <Route path='/volunteer' element={<Volunteer />} />
                  <Route path='/donation' element={<Donations />} />
                  <Route path='/membership' element={<Membership />} />
                  <Route path='/members' element={<Members />} />
                  <Route path='/partnership-request' element={<Partners />} />
                  <Route path='/messages' element={<ContactUs />} />
                  <Route path='/newsletter' element={<Newsletter />} />
                  {/* Add other routes as needed */}
                </Routes>
              </main>
            </>
          ) : (
            <div className="flex flex-1 flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
