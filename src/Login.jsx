import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const hardcodedEmail = 'user@example.com';
  const hardcodedPassword = 'password123';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === hardcodedEmail && password === hardcodedPassword) {
      alert('Login successful!');
      onLogin();  // Update authentication state
      navigate('/working');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#006D5B]">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:border-[#006D5B] transition duration-200"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:border-[#006D5B] transition duration-200"
              placeholder="password123"
              required
            />
          </div>
          <div className="mb-6 text-center">
            <NavLink to="/signup" className="text-[#006D5B] hover:underline">
              Don't have an account? Sign up here.
            </NavLink>
          </div>
          <button
            type="submit"
            className="w-full bg-[#006D5B] text-white py-3 px-4 rounded hover:bg-[#005946] transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
