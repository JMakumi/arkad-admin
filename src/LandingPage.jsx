import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './images/logo.png'; // Make sure the path to the logo is correct

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#FFD700] to-[#006D5B] text-white">
      <div className="text-center">
        <img src={logo} alt="Organization Logo" className="h-20 mb-8 mx-auto" />
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-xl mb-8">Your journey to excellence begins here.</p>
        <button
          onClick={handleGetStarted}
          className="bg-[#006D5B] hover:bg-[#004d40] text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
