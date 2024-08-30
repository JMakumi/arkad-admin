import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';

const Activities = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file.size > 400 * 1024) {
      setError('Image must be less than 400KB.');
      return;
    }

    setImage(URL.createObjectURL(file));
    setError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1
  });

  const handleSubmit = () => {
    if (!title || !venue || !date || !image) {
      setError('Please fill out all fields and upload an image.');
      return;
    }

    // Handle form submission logic here
    console.log({ title, venue, date, image });
    setError('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Activity</h1>
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

export default Activities;
