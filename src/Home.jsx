import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaTasks, FaImages, FaHandsHelping, FaDonate, FaUserFriends, FaHandshake, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import logo from './images/logo.png';

const Home = () => {
  return (
    <div className="flex">
      <aside className="bg-[#006D5B] text-white w-64 min-h-screen p-4 hidden sm:block">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Organization Logo" className="h-20 mb-8" />
          <nav className="flex flex-col space-y-4">
            <Link to="/achievements" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaTrophy />
              <span className="hidden md:inline">Achievements</span>
            </Link>
            <Link to="/activities" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaTasks />
              <span className="hidden md:inline">Activities</span>
            </Link>
            <Link to="/media" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaImages />
              <span className="hidden md:inline">Media</span>
            </Link>
            <Link to="/volunteer" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaHandsHelping />
              <span className="hidden md:inline">Volunteer</span>
            </Link>
            <Link to="/donation" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaDonate />
              <span className="hidden md:inline">Donation</span>
            </Link>
            <Link to="/membership" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaUserFriends />
              <span className="hidden md:inline">Membership</span>
            </Link>
            <Link to="/partnership" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaHandshake />
              <span className="hidden md:inline">Partnership</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaPhoneAlt />
              <span className="hidden md:inline">Contact</span>
            </Link>
            <Link to="/communication" className="flex items-center space-x-2 hover:text-[#FFD700]">
              <FaEnvelope />
              <span className="hidden md:inline">Communication</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#006D5B]">Welcome to the Home Page</h1>
        <p className="mt-4">
          Select an option from the sidebar to get started.
        </p>
      </main>
    </div>
  );
};

export default Home;
