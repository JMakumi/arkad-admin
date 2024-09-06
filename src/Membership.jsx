import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { FaEllipsisH } from 'react-icons/fa';

const MEMBER_URL = "https://arkad-server.onrender.com/users/member";
const key = process.env.REACT_APP_SECRET_KEY;

const Membership = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");  
  const [loading, setLoading] = useState(true);  // Added loading state
  const modalRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    if (!token || !key) return;
    setLoading(true);  // Show loading while data is being fetched
    try {
      const response = await axios.get(MEMBER_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const { ciphertext, iv } = response.data.data;

        const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
          iv: CryptoJS.enc.Hex.parse(iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');

        const decryptedMembers = JSON.parse(decryptedData);
        setMembers(decryptedMembers.length > 0 ? decryptedMembers : []);
      }
    } catch (error) {
      console.error('Error getting members:', error);
      setMessage('Error fetching members: ' + error.message);
    } finally {
      setLoading(false);  // Hide loading once data is fetched
    }
  };

  const handleApprove = async (id) => {
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
  
    try {
      const response = await axios.put(`${MEMBER_URL}/${id}`, { status: 'approved' });
  
      if (response.data.success) {
        setMessage("Membership approved successfully!");
      } else {
        setMembers([...updatedMembers, members.find(member => member.id === id)]);
        setMessage("Failed to approve membership.");
      }
    } catch (error) {
      console.error('Error approving membership:', error);
      setMembers([...updatedMembers, members.find(member => member.id === id)]);
      setMessage("An error occurred while approving membership.");
    } finally {
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleDecline = (member) => {
    setSelectedMember(member);
    setShowDeclineModal(true);
    setShowActions(null); 
  };

  const handleSubmitDecline = async () => {
    const updatedMembers = members.filter(member => member.id !== selectedMember.id);
    setMembers(updatedMembers);
  
    try {
      const response = await axios.put(`${MEMBER_URL}/${selectedMember.id}`, { status: 'declined', reason: declineReason });
  
      if (response.data.success) {
        setMessage("Membership declined successfully!");
      } else {
        setMembers([...updatedMembers, selectedMember]);
        setMessage("Failed to decline membership.");
      }
    } catch (error) {
      console.error('Error declining membership:', error);
      setMembers([...updatedMembers, selectedMember]);
      setMessage("An error occurred while declining membership.");
    } finally {
      setShowDeclineModal(false);
      setTimeout(() => setMessage(""), 5000);
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

      {/* Display message if exists */}
      {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}

      {/* Display loading indicator */}
      {loading ? (
        <div className="text-center">Loading members...</div>
      ) : (
        // Conditionally render the table only if there are members
        members.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Profile</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone Number</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Nationality</th>
                <th className="py-2 px-4 border">Membership Number</th>
                <th className="py-2 px-4 border">Reason For Joining</th>
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
                  <td className="py-2 px-4 border">{member.phoneNumber}</td>
                  <td className="py-2 px-4 border">{member.gender}</td>
                  <td className="py-2 px-4 border">{member.location}</td>
                  <td className="py-2 px-4 border">{member.age}</td>
                  <td className="py-2 px-4 border">{member.nationality}</td>
                  <td className="py-2 px-4 border">{member.memberNumber}</td>
                  <td className="py-2 px-4 border">{member.reasonForJoining}</td>
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
        ) : (
          <div className="text-center text-gray-600">No membership requests found.</div>
        )
      )}

      {showDeclineModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div ref={modalRef} className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Decline Membership</h2>
            <p className="mb-4">Please provide a reason for declining the membership of {selectedMember.firstName} {selectedMember.lastName}.</p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Enter decline reason..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitDecline}
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
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
