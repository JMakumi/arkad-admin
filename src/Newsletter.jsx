import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sources, setSources] = useState([]);

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
    const newsletterData = {
      title,
      content,
      sources,
    };

    try {
      const response = await axios.post('https://your-api-endpoint.com/newsletters', newsletterData);
      alert('Newsletter sent successfully!');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Create Newsletter</h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
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
        <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
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
        <label className="block text-gray-700 font-bold mb-2" htmlFor="sources">
          Sources (separated by commas)
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

      {/* <div className="mt-4">
        <h2 className="text-xl font-semibold">Preview:</h2>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Content:</strong> {content}</p>
        <p><strong>Sources:</strong> {sources.join(', ')}</p>
      </div> */}

      <button
        onClick={handleSubmit}
        className="bg-[#006D5B] text-white p-2 rounded mt-4 hover:bg-[#004d40]"
      >
        Send Newsletter
      </button>
    </div>
  );
};

export default Newsletter;
