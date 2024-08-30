import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://localhost:4000/members');
        // const data = response.data;

        // Dummy data since the endpoint is not available
        const data = [
          { id: 1, firstName: "John", middleName: null, lastName: "Doe", email: "johndoe@example.com", gender: "male", location: "Nairobi", age: 24, nationality: "Kenyan", memberNumber: "A-0001-2024", reason: "Reason" },
          { id: 2, firstName: "Jane", middleName: "Ochieng'", lastName: "Doe", email: "janedoe@example.com", gender: "female", location: "Mombasa", age: 29, nationality: "Kenyan", memberNumber: "A-0002-2024", reason: "Reason" },
          { id: 3, firstName: "Alex", middleName: null, lastName: "Smith", email: "alexsmith@example.com", gender: "male", location: "Kisumu", age: 31, nationality: "Kenyan", memberNumber: "A-0003-2024", reason: "Reason" },
          { id: 4, firstName: "Emily", middleName: "Wanjiku", lastName: "Mwangi", email: "emilymwangi@example.com", gender: "female", location: "Nairobi", age: 22, nationality: "Kenyan", memberNumber: "A-0004-2024", reason: "Reason" },
          { id: 5, firstName: "Michael", middleName: null, lastName: "Brown", email: "michaelbrown@example.com", gender: "male", location: "Eldoret", age: 27, nationality: "Kenyan", memberNumber: "A-0005-2024", reason: "Reason" },
          { id: 6, firstName: "Sophia", middleName: "Akinyi", lastName: "Omondi", email: "sophiaomondi@example.com", gender: "female", location: "Nairobi", age: 30, nationality: "Kenyan", memberNumber: "A-0006-2024", reason: "Reason" },
          { id: 7, firstName: "David", middleName: null, lastName: "Johnson", email: "davidjohnson@example.com", gender: "male", location: "Nakuru", age: 35, nationality: "Kenyan", memberNumber: "A-0007-2024", reason: "Reason" },
          { id: 8, firstName: "Grace", middleName: "Njeri", lastName: "Kariuki", email: "gracekariuki@example.com", gender: "female", location: "Nairobi", age: 28, nationality: "Kenyan", memberNumber: "A-0008-2024", reason: "Reason" },
          { id: 9, firstName: "Chris", middleName: null, lastName: "Williams", email: "chriswilliams@example.com", gender: "male", location: "Kisumu", age: 33, nationality: "Kenyan", memberNumber: "A-0009-2024", reason: "Reason" },
          { id: 10, firstName: "Lilian", middleName: "Nyambura", lastName: "Wambui", email: "lilianwambui@example.com", gender: "female", location: "Thika", age: 26, nationality: "Kenyan", memberNumber: "A-0010-2024", reason: "Reason" },
          { id: 11, firstName: "James", middleName: "Kiptoo", lastName: "Koech", email: "jameskoech@example.com", gender: "male", location: "Nakuru", age: 23, nationality: "Kenyan", memberNumber: "A-0011-2024", reason: "Reason" },
          { id: 12, firstName: "Mary", middleName: "Atieno", lastName: "Otieno", email: "maryotieno@example.com", gender: "female", location: "Kisumu", age: 32, nationality: "Kenyan", memberNumber: "A-0012-2024", reason: "Reason" },
        ];

        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchData();
  }, []);

  // Get current members
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Arkad Family Members</h1>
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
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member) => (
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
            </tr>
          ))}
        </tbody>
      </table>

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
