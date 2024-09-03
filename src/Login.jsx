import React, { useState } from 'react';
import axios from "axios"
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, NavLink } from 'react-router-dom';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const LOGIN_URL="https://arkad-server.onrender.com/users/login";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password){
      return;
    }
    setLoading(true);

    
    try {
      const dataToEncrypt = {
        username: email,
        password: password
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

      const response = await axios.post(LOGIN_URL, payload);
      if(response.data.success){
        onLogin();
        navigate('/working');
        const decodedToken = jwtDecode(response.data.accessToken);
        console.log(response.data.accessToken);
        const userDetails = {
            id: decodedToken.id,
            username: decodedToken.username
          };
        localStorage.setItem("userData", JSON.stringify(userDetails));
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
      }else{
        setError(response.data.message);
        setTimeout(() => setError(""), 5000);
        return;
      }
  } catch (error) {
    setError("There was an error loging in", error);
    setTimeout(() => setError(""), 5000);
    return;
  }finally{
    setLoading(false);
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
            <NavLink to="/forgot-password" className="text-[#006D5B] hover:underline">
              Forgot your password?
            </NavLink>
          </div>
          {error && (
            <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
          )}
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

export default Login;
