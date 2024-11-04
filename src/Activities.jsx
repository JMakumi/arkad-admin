import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';

const ACTIVITIES_URL = "https://arkad-server.onrender.com/users/activities";

const Activities = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
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
    if (userData) setUserId(JSON.parse(userData).id);
  }, []);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError('You can only upload one image.');
      setTimeout(() => setError(""), 10000);
      return;
    }
  
    const file = acceptedFiles[0];
    const fileName = file.name;
  
    if (file.size > 400 * 1024) {
      try {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
  
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], fileName, {
          type: file.type,
          lastModified: Date.now(),
        });
  
        setImage(compressedFile);
        setCompressedSize(compressedFile.size);
        setError('');
      } catch (error) {
        setError('Failed to compress the image.');
        setTimeout(() => setError(""), 5000);
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
    if (!title || !venue || !date || !image || !userId) {
      setError('Please fill out all fields and upload an image.');
      setTimeout(() => setError(""), 5000);
      return;
    }
    if (!token || !userId) return;
    setLoading(true);
    console.log(`ID: ${userId}`);

    try {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("venue", venue);
      payload.append("date", date);
      payload.append("userId", userId);
      payload.append("image", image);

      const response = await fetch(ACTIVITIES_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: payload
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 5000);
        setTitle('');
        setVenue('');
        setDate('');
        setImage(null);
        setCompressedSize(null);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError('There was an error submitting your data');
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Get current date in YYYY-MM-DD format for date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Activity</h1>
      <div className="image-upload mb-4" {...getRootProps()}>
        <input required {...getInputProps()} />
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
          <label htmlFor="title" className="block text-[#006D5B] mb-2">Title</label>
          <input
            id="title"
            type="text"
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
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
            min={today}  // Restrict to today and future dates
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

export default Activities;
