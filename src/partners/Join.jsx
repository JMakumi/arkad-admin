import React, { useState } from 'react';

const Join = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    location: '',
    age: '',
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
    console.log('Join Form Data:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#006D5B]">Join Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          placeholder="Middle Name (Optional)"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
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
          pattern="[0-9]{10}"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer not to say">Prefer not to say</option>
          <option value="other">Other</option>
        </select>
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
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          min="5"
          max="99"
          className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
          required
        />
        <button type="submit" className="bg-[#006D5B] text-black px-4 py-2 rounded-md transform transition-transform hover:scale-105">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Join;
