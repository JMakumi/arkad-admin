import React, { useState } from 'react';

const Support = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    mpesaCode: '',
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
    console.log('Support Form Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#006D5B]">Support Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
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
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="mpesaCode"
          value={formData.mpesaCode}
          onChange={handleChange}
          placeholder="Mpesa Code"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        />

        <div className="flex items-center mb-4">
          <p className="text-lg font-semibold text-[#006D5B]">
            Mpesa: <span className="text-black">+254 791 693 221</span>
          </p>
        </div>

        <button type="submit" className="bg-[#006D5B] text-black px-4 py-2 rounded-md transform transition-transform hover:scale-105">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Support;
