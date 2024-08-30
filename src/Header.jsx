import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './images/logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#006D5B] text-white z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu}> {/* Close menu when logo is clicked */}
              <img src={logo} alt="Ark Family Logo" className="h-16" />
            </Link>
            <div className="hidden md:flex items-center ml-4">
              <p className="text-base md:text-lg">
                Empowering Africa's socio-economic growth through mentorship, collaboration, and sustainable innovation
              </p>
            </div>
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        <div className="md:hidden mt-2">
          <p className="text-xs mt-2">
            Empowering Africa's socio-economic growth through mentorship, collaboration, and sustainable innovation
          </p>
        </div>
      </div>

      <nav
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:flex md:justify-between bg-[#FFD700] text-black px-4 py-2 transform md:transform-none transition-transform duration-300`}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className={`block py-2 md:py-0 md:inline-block md:ml-48 ${
            location.pathname === '/' ? 'text-[#006D5B] font-semibold' : 'text-black hover:text-[#006D5B]'
          }`}
        >
          Home
        </Link>
        <Link
          to="/about-us"
          onClick={closeMenu}
          className={`block py-2 md:py-0 md:inline-block ${
            location.pathname === '/about-us' ? 'text-[#006D5B] font-semibold' : 'text-black hover:text-[#006D5B]'
          }`}
        >
          About Us
        </Link>
        <Link
          to="/departments"
          onClick={closeMenu}
          className={`block py-2 md:py-0 md:inline-block ${
            location.pathname === '/departments' ? 'text-[#006D5B] font-semibold' : 'text-black hover:text-[#006D5B]'
          }`}
        >
          Departments
        </Link>
        <Link
          to="/events-activities"
          onClick={closeMenu}
          className={`block py-2 md:py-0 md:inline-block ${
            location.pathname === '/events-activities' ? 'text-[#006D5B] font-semibold' : 'text-black hover:text-[#006D5B]'
          }`}
        >
          Events & Activities
        </Link>
        <Link
          to="/media"
          onClick={closeMenu}
          className={`block py-2 md:py-0 md:inline-block md:mr-32 ${
            location.pathname === '/media' ? 'text-[#006D5B] font-semibold' : 'text-black hover:text-[#006D5B]'
          }`}
        >
          Media
        </Link>
      </nav>
    </header>
  );
};

export default Header;
