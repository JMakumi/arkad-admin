import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const MEMBER_URL = "https://arkad-server.onrender.com/users/all-members";
const key = process.env.REACT_APP_SECRET_KEY;

const Members = () => {
  const [members, setMembers] = useState([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");  
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if(token) fetchData();
  }, [token]);

  const fetchData = async () => {
    if(!token) return;
    setLoading(true);
    try {
      const response = await axios.get(MEMBER_URL, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      if(response.data.success){
        const { ciphertext, iv } = response.data.data;

        const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
          iv: CryptoJS.enc.Hex.parse(iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');

        const decryptedMessages = JSON.parse(decryptedData);
        setMembers(decryptedMessages.length > 0 ? decryptedMessages : []);
      }
      
    } catch (error) {
      console.error('Error fetching members:', error);
      setMessage('Error fetching members: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    }finally{
      setLoading(false);
    }
  };

  // Get current members
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Arkad Family Members</h1>
      {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : currentMembers.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Profile</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone Number</th>
              <th className="py-2 px-4 border">Gender</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Nationality</th>
              <th className="py-2 px-4 border">Membership Number</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member) => (
              <tr key={member.id}>
                <td className="py-2 px-4 border">
                  {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}
                </td>
                <td className="py-2 px-4 border">{member.email}</td>
                <td className="py-2 px-4 border">{member.phoneNumber}</td>
                <td className="py-2 px-4 border">{member.gender}</td>
                <td className="py-2 px-4 border">{member.location}</td>
                <td className="py-2 px-4 border">{member.nationality}</td>
                <td className="py-2 px-4 border">{member.memberNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Members Found</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ul className="flex space-x-2">
          {[...Array(Math.ceil(members.length / membersPerPage))].map((_, index) => (
            <li key={index}>
              <button
                onClick={() => paginate(index + 1)}
                className={`p-2 border rounded ${currentPage === index + 1 ? 'bg-[#006D5B] text-white' : 'bg-white text-black'}`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Members;
