import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const ACHIEVEMENTS_URL = "https://arkad-server.onrender.com/users/achievement";
const secretKey = process.env.REACT_APP_SECRET_KEY;

const Achievements = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem("userData");
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
    if (userData) setUserId(JSON.parse(userData).id)
  }, []);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError('You can only upload one image.');
      setTimeout(() => setError(""), 10000);
      return;
    }
  
    const file = acceptedFiles[0];
  
    // Extract the file name and extension
    const fileName = file.name;
  
    if (file.size > 400 * 1024) {
      try {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
  
        const compressedBlob = await imageCompression(file, options);
  
        // Create a new File object with the original name and extension
        const compressedFile = new File([compressedBlob], fileName, {
          type: file.type,
          lastModified: Date.now(),
        });
  
        setImage(compressedFile);
        setCompressedSize(compressedFile.size);
        setError('');
      } catch (error) {
        setError('Failed to compress the image.');
        setTimeout(() => setError(""), 10000);
      }
    } else {
      setImage(file);
      setCompressedSize(file.size);
      setError('');
    }
  };
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png',
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!description || !venue || !date || !image) {
      setError('Please fill out all fields and upload an image.');
      setTimeout(() => setError(""), 5000);
      return;
    }
    if(!token || !secretKey || !userId) return
    setLoading(true);

    try {
      const dataToEncrypt = {
        description: description,
        venue: venue,
        date: date,
        userId: userId
      };

      const dataStr = JSON.stringify(dataToEncrypt);
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }).toString();

      const payload = new FormData();
      payload.append("iv", iv);
      payload.append("ciphertext", encryptedData);
      payload.append("image", image); 

      Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));

      const response = await axios.post(ACHIEVEMENTS_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(""), 5000);
        setDescription('');
        setVenue('');
        setDate('');
        setImage(null);
        setCompressedSize(null);
      } else {
        setError(response.data.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError('There was an error submitting your data');
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Achievements</h1>
      <div className="image-upload mb-4" {...getRootProps()}>
        <input required {...getInputProps()} />
        <div className="upload-content text-center p-4 border-dashed border-2 border-[#006D5B] rounded">
          <FaUpload className="text-[#006D5B] text-2xl mb-2" />
          <p className="text-[#006D5B]">Drag & drop your image here, or click to select it.</p>
        </div>
        {image && (
          <div className="uploaded-image mt-4">
            <img src={URL.createObjectURL(image)} alt="Preview" className="w-32 h-32 object-cover border rounded" />
            <p className="text-sm text-gray-500">Compressed size: {(compressedSize / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
      <div className="form-fields">
        <div className="mb-4">
          <label htmlFor="description" className="block text-[#006D5B] mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="venue" className="block text-[#006D5B] mb-2">Venue</label>
          <input
            id="venue"
            type="text"
            placeholder='Venue'
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-[#006D5B] mb-2">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <button
          onClick={handleSubmit}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Achievements;
