import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const CHANGE_PASSWORD_URL = "https://arkad-server.onrender.com/users/change-password";

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const storedAccessToken = localStorage.getItem('accessToken');
    if(storedAccessToken) setToken(storedAccessToken)
  }, [])

  const validatePassword = (password) => {
    const lengthRequirement = /.{6,15}/;
    const uppercaseRequirement = /[A-Z]/;
    const lowercaseRequirement = /[a-z]/;
    const numberRequirement = /[0-9]/;
    const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/;

    if (!lengthRequirement.test(password)) {
      return "Password must be 6-15 characters long.";
    } else if (!uppercaseRequirement.test(password)) {
      return "Password must contain at least one uppercase letter.";
    } else if (!lowercaseRequirement.test(password)) {
      return "Password must contain at least one lowercase letter.";
    } else if (!numberRequirement.test(password)) {
      return "Password must contain at least one number.";
    } else if (!specialCharRequirement.test(password)) {
      return "Password must contain at least one special character.";
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    const validationMessage = validatePassword(password);
    setPasswordError(validationMessage);

    if (validationMessage === '') {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (passwordError) {
      setError('Please meet all password requirements.');
      return;
    }

    setLoading(true);

    try {
      const dataToEncrypt = { email, newPassword };
      const dataStr = JSON.stringify(dataToEncrypt);
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }).toString();

      const payload = { iv, ciphertext: encryptedData };

      const response = await axios.put(CHANGE_PASSWORD_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        navigate('/success');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('There was an error changing your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#006D5B]">Change Password</h2>
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
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded focus:outline-none focus:border-[#006D5B] transition duration-200"
              placeholder="Enter your new password"
              required
            />
            <div className="text-sm text-red-500 mt-1">{passwordError}</div>
            <div className="text-sm text-green-500 mt-1">{passwordStrength}</div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:border-[#006D5B] transition duration-200"
              placeholder="Confirm your new password"
              required
            />
          </div>
          {error && <div className="text-red-500 mt-2 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#006D5B] text-white py-3 px-4 rounded hover:bg-[#005946] transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
