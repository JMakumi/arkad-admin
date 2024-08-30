import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    // Fetch the volunteer data (using dummy data here for demonstration)
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://localhost:4000/volunteer');
        // const data = response.data;

        // Dummy data since endpoint is not available
        const data = [
          { fullName: 'John Doe', phoneNumber: '0748800714', email: 'johndoe@example.com', location: 'Nairobi', event: 'Home Visit' },
          { fullName: 'Jane Smith', phoneNumber: '0748800715', email: 'janesmith@example.com', location: 'Nairobi', event: 'Medical Camp' },
          { fullName: 'Alice Johnson', phoneNumber: '0748800716', email: 'alicejohnson@example.com', location: 'Mombasa', event: 'Home Visit' },
          { fullName: 'Bob Brown', phoneNumber: '0748800717', email: 'bobbrown@example.com', location: 'Kisumu', event: 'Medical Camp' },
        ];

        setVolunteers(data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFilteredVolunteers(volunteers.filter(v => v.event === event));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add the organization logo
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Add title
    doc.setFontSize(18);
    doc.text(`${selectedEvent} Volunteers`, 10, 40);

    // Add the table
    doc.autoTable({
      startY: 50,
      head: [['Full Name', 'Phone Number', 'Email', 'Location']],
      body: filteredVolunteers.map(v => [v.fullName, v.phoneNumber, v.email, v.location]),
    });

    doc.save(`${selectedEvent}_Volunteers.pdf`);
  };

  const events = [...new Set(volunteers.map(v => v.event))]; // Extract unique events

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Volunteers Data</h1>
      <div className="mb-4">
        {events.map((event) => (
          <button
            key={event}
            onClick={() => handleEventClick(event)}
            className="bg-[#006D5B] text-white p-2 m-2 rounded hover:bg-[#004d40]"
          >
            {event}
          </button>
        ))}
      </div>

      {selectedEvent && (
        <>
          <h2 className="text-xl font-bold text-[#006D5B] mb-2">{selectedEvent} Volunteers</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Full Name</th>
                <th className="py-2 px-4 border">Phone Number</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{volunteer.fullName}</td>
                  <td className="py-2 px-4 border">{volunteer.phoneNumber}</td>
                  <td className="py-2 px-4 border">{volunteer.email}</td>
                  <td className="py-2 px-4 border">{volunteer.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleDownloadPDF}
            className="bg-[#006D5B] text-white p-2 mt-4 rounded hover:bg-[#004d40]"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default Volunteer;
