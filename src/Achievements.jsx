import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { FaUpload } from 'react-icons/fa';

const Achievements = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError('You can only upload one image.');
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > 400 * 1024) {
      try {
        const options = {
          maxSizeMB: 0.4, // The target size is 0.4MB (400KB)
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
    if (!description || !venue || !date || !image) {
      setError('Please fill out all fields and upload an image.');
      return;
    }
    // Handle form submission logic here
    console.log({ description, venue, date, image });
    setError('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Achievements</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="image-upload mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="upload-content text-center p-4 border-dashed border-2 border-[#006D5B] rounded">
          <FaUpload className="text-[#006D5B] text-2xl mb-2" />
          <p className="text-[#006D5B]">Drag & drop your image here, or click to select it.</p>
        </div>
        {image && (
          <div className="uploaded-image mt-4">
            <img src={image} alt="Preview" className="w-32 h-32 object-cover border rounded" />
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

export default Achievements;
