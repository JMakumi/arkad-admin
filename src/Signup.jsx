import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const SIGNUP_URL="http://localhost:3050/users/signup";
const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !firstName || !lastName){
      setError("Missing required fields");
      return;
    }

    try {
      const dataToEncrypt = {
        username: email,
        firstName: firstName,
        lastName: lastName
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

      const response = await axios.post(SIGNUP_URL, payload);

      console.log(response.data.message);
      if(response.data.message === "There was an error making your request. Error: AxiosError: Request failed with status code 409"){
        setError(response.data.message);
        setTimeout(() => setError(""),5000);
        return;
      }

      if(response.data.success){
        setSuccess(response.data.message);
        setTimeout(()=>setSuccess(""),5000);
        setEmail("");
        setFirstName("");
        setLastName("");

      }else{
        setError(response.data.message);
        setTimeout(() => setError(""),5000);
        return;
      };
      
    } catch (error) {
      setError(`There was an error making your request. Error: ${error}`);
      setTimeout(() => setError(""),5000);
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center text-[#006D5B] mb-6">Create New User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder='johndoe@example.com'
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
            placeholder='John'
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
            placeholder='Doe'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-600 mt-2 text-sm text-center">{success}</div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-[#006D5B] hover:bg-teal-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
