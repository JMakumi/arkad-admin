import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const FORGOT_PASSWORD_URL = "https://arkad-server.onrender.com/users/reset-password";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      setTimeout(() => setError(""), 5000);
      return;
    }
    setLoading(true);

    try {
      const dataToEncrypt = {
        username: email
      };

      const dataStr = JSON.stringify(dataToEncrypt);
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString();

      const payload = {
        iv: iv,
        ciphertext: encryptedData
      };

      const response = await axios.put(FORGOT_PASSWORD_URL, payload);
      if (response.data.success) {
        setSuccess("New password has been sent to your email");
        setTimeout(() => setSuccess(""), 15000);
        navigate('/login');
      } else {
        setError(response.data.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error processing your request. Error: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#006D5B]">Forgot Password</h2>
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
          {error && (
            <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 mt-2 text-sm text-center">{success}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#006D5B] text-white py-3 px-4 rounded hover:bg-[#005946] transition duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
