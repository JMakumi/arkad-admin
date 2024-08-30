import React, { useState } from 'react';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Volunteer information:', formData);
    // Further logic to handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Volunteer Information</h2>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        className="p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="bg-[#006D5B] text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default Volunteer;
