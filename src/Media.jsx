import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';

const MEDIA_URL = "https://arkad-server.onrender.com/users/media";

const Media = () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [compressedSizes, setCompressedSizes] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem("userData");
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
    if (userData) setUserId(JSON.parse(userData).id);
  }, []);

  const onDrop = async (acceptedFiles) => {
    let compressedImages = [];
    let sizes = [];

    for (let file of acceptedFiles) {
      try {
        let compressedFile;
        if (file.size > 400 * 1024) {
          const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedBlob = await imageCompression(file, options);
          compressedFile = new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now() });
        } else {
          compressedFile = file;
        }
        compressedImages.push(compressedFile);
        sizes.push(compressedFile.size);
      } catch (error) {
        setError('Failed to compress one or more images.');
        return;
      }
    }

    setImages([...images, ...compressedImages]);
    setCompressedSizes([...compressedSizes, ...sizes]);
    setError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png',
    maxFiles: 3,
  });

  const handleSubmit = async () => {
    if (!description || images.length === 0) {
      setError('Please enter a description and upload at least one image.');
      return;
    }
    if (!token || !userId) return;

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("description", description);
      payload.append("userId", userId);

      images.forEach((image) => {
        payload.append('images', image); 
      });
      

      const response = await fetch(MEDIA_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setDescription('');
        setImages([]);
        setCompressedSizes([]);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('There was an error submitting your data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Media</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="image-upload mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="upload-content text-center p-4 border-dashed border-2 border-[#006D5B] rounded">
          <FaUpload className="text-[#006D5B] text-2xl mb-2" />
          <p className="text-[#006D5B]">Drag & drop up to 3 images here, or click to select them (Max: 400KB per image).</p>
        </div>
        <div className="uploaded-images mt-4 grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index} className="uploaded-image">
              <img src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover border rounded mx-auto" />
              <p className="text-sm text-gray-500 text-center">Size: {(compressedSizes[index] / 1024).toFixed(2)} KB</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-fields">
        <div className="mb-4">
          <label htmlFor="description" className="block text-[#006D5B] mb-2">Event Description</label>
          <textarea
            id="description"
            value={description}
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            rows="4"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
};

export default Media;
