import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEllipsisH } from 'react-icons/fa';

const Membership = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const modalRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dummy data since the endpoint is not available
        const data = [
          { id: 1, firstName: "John", middleName: null, lastName: "Doe", email: "johndoe@example.com", gender: "male", location: "Nairobi", age: 24, nationality: "Kenyan", memberNumber: "A-0001-2024", reason: "Reason" },
          { id: 2, firstName: "John", middleName: "Ochieng'", lastName: "Doe", email: "johndoe@example.com", gender: "male", location: "Nairobi", age: 24, nationality: "Kenyan", memberNumber: "A-0002-2024", reason: "Reason" },
          { id: 3, firstName: "John", middleName: null, lastName: "Doe", email: "johndoe@example.com", gender: "male", location: "Nairobi", age: 24, nationality: "Kenyan", memberNumber: "A-0003-2024", reason: "Reason" }
        ];

        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`https://localhost:4000/membership/${id}`, { status: 'approved' });
      alert('Membership approved!');
      setShowActions(null); // Close the actions overlay
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };

  const handleDecline = (member) => {
    setSelectedMember(member);
    setShowDeclineModal(true);
    setShowActions(null); // Close the actions overlay
  };

  const handleSubmitDecline = async () => {
    try {
      await axios.put(`https://localhost:4000/membership/${selectedMember.id}`, { status: 'declined', reason: declineReason });
      alert('Membership declined!');
      setShowDeclineModal(false);
    } catch (error) {
      console.error('Error declining membership:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowDeclineModal(false);
    }

    if (actionsRef.current && !actionsRef.current.contains(event.target)) {
      setShowActions(null);
    }
  };

  useEffect(() => {
    if (showDeclineModal || showActions !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeclineModal, showActions]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">Arkad Membership Requests</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Profile</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Gender</th>
            <th className="py-2 px-4 border">Location</th>
            <th className="py-2 px-4 border">Age</th>
            <th className="py-2 px-4 border">Nationality</th>
            <th className="py-2 px-4 border">Membership Number</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="py-2 px-4 border">
                {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}
              </td>
              <td className="py-2 px-4 border">{member.email}</td>
              <td className="py-2 px-4 border">{member.gender}</td>
              <td className="py-2 px-4 border">{member.location}</td>
              <td className="py-2 px-4 border">{member.age}</td>
              <td className="py-2 px-4 border">{member.nationality}</td>
              <td className="py-2 px-4 border">{member.memberNumber}</td>
              <td className="py-2 px-4 border relative">
                <FaEllipsisH
                  onClick={() => setShowActions(showActions === member.id ? null : member.id)}
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                />
                {showActions === member.id && (
                  <div
                    ref={actionsRef}
                    className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10"
                  >
                    <button
                      onClick={() => handleApprove(member.id)}
                      className="block w-full text-left p-2 hover:bg-[#004d40] hover:text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(member)}
                      className="block w-full text-left p-2 hover:bg-red-600 hover:text-white"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeclineModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div ref={modalRef} className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Decline Membership</h2>
            <p className="mb-4">Please provide a reason for declining the membership of {selectedMember.firstName} {selectedMember.lastName}.</p>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter decline reason..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitDecline}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDeclineModal(false)}
                className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
