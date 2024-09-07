import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const LEADERSHIP_URL = "https://arkad-server.onrender.com/users/leaders";
const key = process.env.REACT_APP_SECRET_KEY;

const Leadership = () => {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
    if (userData) setUserId(JSON.parse(userData).id);
  }, []);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file.size > 400 * 1024) {
      try {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };

        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        setImage(compressedFile);
        setCompressedSize(compressedFile.size);
        setError('');
      } catch (error) {
        setError('Failed to compress the image.');
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
    if (!role || !name || !image) {
      setError('Please fill out all fields and upload an image.');
      return;
    }
    if (!token || !key || !userId) return;
    setLoading(true);

    try {
      const dataToEncrypt = {
        userId,
        name,
        role,
      };

      const dataStr = JSON.stringify(dataToEncrypt);
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }).toString();

      const payload = new FormData();
      payload.append('iv', iv);
      payload.append('ciphertext', encryptedData);
      payload.append('image', image); // Append image file

      const response = await axios.post(LEADERSHIP_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setName('');
        setRole('');
        setImage(null);
        setMessage(response.data.message);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setError(response.data.message);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('Error sending leadership info:', error);
      setError('Error submitting the data: ' + error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Leadership</h1>

      <div className="image-upload mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="upload-content text-center p-4 border-dashed border-2 border-[#006D5B] rounded">
          <FaUpload className="text-[#006D5B] text-2xl mb-2" />
          <p className="text-[#006D5B]">Drag & drop your image here, or click to select it (Max: 400KB).</p>
        </div>
        {image && (
          <div className="uploaded-image mt-4">
            <img src={URL.createObjectURL(image)} alt="Preview" className="w-32 h-32 object-cover border rounded mx-auto" />
            <p className="text-sm text-gray-500">Compressed size: {(compressedSize / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>

      <div className="form-fields">
        <div className="mb-4">
          <label htmlFor="name" className="block text-[#006D5B] mb-2">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-[#006D5B] mb-2">Role</label>
          <input
            id="role"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            required
          />
        </div>
        {error && <div className="text-red-500 mt-2 text-sm text-center">{error}</div>}
        {message && <div className="text-green-600 mt-2 text-sm text-center">{message}</div>}
        <button
          onClick={handleSubmit}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Leadership;
