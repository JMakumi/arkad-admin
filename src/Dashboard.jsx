// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTasks, FaImages, FaHandsHelping, FaDonate, FaEnvelope, FaUserFriends, FaHandshake,
  FaNewspaper, FaCogs, FaUserTie, FaChevronDown, FaChevronRight, FaUserCircle,
} from 'react-icons/fa';

const Dashboard = ({ userRole, onLogout }) => {
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [leadershipOpen, setLeadershipOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);

  const toggleDropdown = (setDropdownState, dropdownState) => {
    setDropdownState(!dropdownState);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData.name);
      setRole(storedUserData.role)
    }
  }, []);

  return (
    <nav className="flex flex-col space-y-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <FaUserCircle className="text-6xl text-[#FFD700]" />
        <h2 className="text-xl font-bold mt-2">Welcome, {userData}!</h2>
        <button
          onClick={onLogout}
          className="mt-3 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Achievements Dropdown */}
      <div>
        <div
          onClick={() => toggleDropdown(setAchievementsOpen, achievementsOpen)}
          className="flex items-center space-x-2 cursor-pointer hover:text-[#FFD700]"
        >
          <FaTasks className="text-xl" />
          <span>Achievements</span>
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
          className="flex items-center space-x-2 cursor-pointer hover:text-[#FFD700]"
        >
          <FaTasks className="text-xl" />
          <span>Activities</span>
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
          className="flex items-center space-x-2 cursor-pointer hover:text-[#FFD700]"
        >
          <FaImages className="text-xl" />
          <span>Media</span>
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
          className="flex items-center space-x-2 cursor-pointer hover:text-[#FFD700]"
        >
          <FaUserFriends className="text-xl" />
          <span>Membership</span>
          {membershipOpen ? <FaChevronDown /> : <FaChevronRight />}
        </div>
        {membershipOpen && (
          <div className="pl-8">
            <Link to="/members" className="block py-2 hover:text-[#FFD700]">Members</Link>
            <Link to="/membership" className="block py-2 hover:text-[#FFD700]">Membership Requests</Link>
          </div>
        )}
      </div>

      {/* Leadership Dropdown */}
      <div>
        <div
          onClick={() => toggleDropdown(setLeadershipOpen, leadershipOpen)}
          className="flex items-center space-x-2 cursor-pointer hover:text-[#FFD700]"
        >
          <FaUserTie className="text-xl" />
          <span>Leadership</span>
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
      {role === 'super-admin' && (
        <Link to="/signup" className="flex items-center space-x-2 hover:text-[#FFD700]">
          <FaHandsHelping className="text-xl" />
          <span>Create User</span>
        </Link>
      )}
      {role === 'super-admin' && (
        <Link to="/remove-user" className="flex items-center space-x-2 hover:text-[#FFD700]">
          <FaHandsHelping className="text-xl" />
          <span>Users</span>
        </Link>
      )}
      <Link to="/volunteer" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaHandsHelping className="text-xl" />
        <span>Volunteer</span>
      </Link>
      <Link to="/donation" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaDonate className="text-xl" />
        <span>Donation</span>
      </Link>
      <Link to="/partners" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaHandshake className="text-xl" />
        <span>Partnership Requests</span>
      </Link>
      <Link to="/newsletter" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaNewspaper className="text-xl" />
        <span>Newsletter</span>
      </Link>
      <Link to="/contact-us" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaEnvelope className="text-xl" />
        <span>Messages</span>
      </Link>
      <Link to="/change-password" className="flex items-center space-x-2 hover:text-[#FFD700]">
        <FaCogs className="text-xl" />
        <span>Change Password</span>
      </Link>
    </nav>
  );
};

export default Dashboard;
