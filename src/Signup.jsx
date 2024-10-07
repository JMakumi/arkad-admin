import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const SIGNUP_URL="https://arkad-server.onrender.com/users/signup";
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

      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if(result.success){
        setSuccess(result.message);
        setTimeout(()=>setSuccess(""),5000);
        setEmail("");
        setFirstName("");
        setLastName("");

      }else{
        setError(result.message);
        setTimeout(() => setError(""),5000);
        return;
      };
      
    } catch (error) {
      if (error.message === "Request failed with status code 409"){
        setError("Username already exist");
        setTimeout(() => setError(""),5000);
        return;
      }
      setError(`There was an error making your request. Error: ${error}`);
      setTimeout(() => setError(""),5000);
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#006D5B]">Create New User</h1>
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
            className="w-full bg-[#006D5B] text-white py-3 px-4 rounded hover:bg-[#005946] transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Signup;
