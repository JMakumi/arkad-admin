import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';

const Media = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
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
    if (!description || !image) {
      setError('Please enter a description and upload an image.');
      return;
    }

    // Handle form submission logic here
    console.log({ description, image });
    setError('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Add Media</h1>
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

export default Media;
