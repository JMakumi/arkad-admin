import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const NEWLETTER_URL = "https://arkad-server.onrender.com/users/newsletter";
const key = process.env.REACT_APP_SECRET_KEY;

const Newsletter = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sources, setSources] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem("userData");
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
    if (userData) setUserId(JSON.parse(userData).id)
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSourcesChange = (e) => {
    const sourcesArray = e.target.value.split(',').map(source => source.trim());
    setSources(sourcesArray);
  };

  const handleSubmit = async () => {
    if(!token || !key || !userId) return;
    setLoading(true);
    const newsletterData = {
      title,
      content,
      sources,
      userId
    };

    try {
      const dataStr = JSON.stringify(newsletterData);
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString();

      const payload = {
        iv: iv,
        ciphertext: encryptedData
      };


      const response = await fetch(NEWLETTER_URL, {
        method: "POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if(result.success){
        setContent("");
        setTitle("");
        setSources([]);
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }else{
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setError('Error fetching members: ' + error.message);
      setTimeout(() => setError(""), 5000);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Create Newsletter</h1>
      
      <div className="mb-4">
        <label className="block text-[#006D5B] font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter the title"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#006D5B] font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter the content"
          rows="5"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#006D5B] font-bold mb-2" htmlFor="sources">
          References (separated by commas)
        </label>
        <input
          type="text"
          id="sources"
          onChange={handleSourcesChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter sources separated by commas"
          required
        />
      </div>
      {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
      {message && (
        <div className="text-green-600 mt-2 text-sm text-center">{message}</div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-[#006D5B] text-white p-2 rounded mt-4 hover:bg-[#004d40]"
      >
        {loading? "Sending..." : "Submit"}
      </button>
    </div>
  );
};

export default Newsletter;
