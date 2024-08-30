import React, { useState } from 'react';

const Partner = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    website: '',
    contact: '',
    location: '',
    organizationType: '',
    partnershipDetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Partner Form Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#006D5B]">Partner with Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          placeholder="Organization Name"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        />
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
            required
        />
        <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website (Optional)"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
            pattern="[0-9]{10}"
            required
        />
        <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
            required
        />
        <input
            type="text"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            placeholder="Organization Type"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
            required
        />
        <textarea
            name="partnershipDetails"
            value={formData.partnershipDetails}
            onChange={handleChange}
            placeholder="Partnership Details"
            className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
            rows="4"
            required
        ></textarea>
        <button type="submit" className="bg-[#006D5B] text-black px-4 py-2 rounded-md transform transition-transform hover:scale-105">
            Submit
        </button>
        </form>
    </div>
); };

export default Partner;       
