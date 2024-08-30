import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(passwordValid).every(Boolean)) {
      console.log('Signup data:', { email, firstName, lastName, password });
      // Submit the data here, e.g., send a POST request
    } else {
      alert('Please meet all password requirements.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-[#006D5B] mb-6">Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <ul className="text-sm text-gray-600 mt-2">
            <li className={passwordValid.length ? 'text-green-600' : 'text-red-600'}>At least 6 characters</li>
            <li className={passwordValid.uppercase ? 'text-green-600' : 'text-red-600'}>At least one uppercase letter</li>
            <li className={passwordValid.lowercase ? 'text-green-600' : 'text-red-600'}>At least one lowercase letter</li>
            <li className={passwordValid.number ? 'text-green-600' : 'text-red-600'}>At least one number</li>
            <li className={passwordValid.specialChar ? 'text-green-600' : 'text-red-600'}>At least one special character</li>
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#006D5B] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-[#006D5B] font-bold">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
