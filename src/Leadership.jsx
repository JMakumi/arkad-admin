import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';

const Leadership = () => {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState("");
  const [error, setError] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file.size > 400 * 1024) {
      try {
        const options = {
          maxSizeMB: 0.4, 
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };

        const compressedFile = await imageCompression(file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
        setImage(compressedUrl);
        setCompressedSize(compressedFile.size);
        setError('');
      } catch (error) {
        setError('Failed to compress the image.');
      }
    } else {
      const url = URL.createObjectURL(file);
      setImage(url);
      setCompressedSize(file.size);
      setError('');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png',
    maxFiles: 1,
  });

  const handleSubmit = () => {
    if (!role || !name || !image) {
      setError('Please fill out all fields and upload an image.');
      return;
    }

    console.log({ role, name, image });
    setError('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Leadership</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="image-upload mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="upload-content text-center p-4 border-dashed border-2 border-[#006D5B] rounded">
          <FaUpload className="text-[#006D5B] text-2xl mb-2" />
          <p className="text-[#006D5B]">Drag & drop your image here, or click to select it (Max: 400KB).</p>
        </div>
        {image && (
          <div className="uploaded-image mt-4">
            <img src={image} alt="Preview" className="w-32 h-32 object-cover border rounded mx-auto" />
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
            placeholder='Name'
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
            placeholder='Role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-[#006D5B] rounded"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Leadership;
