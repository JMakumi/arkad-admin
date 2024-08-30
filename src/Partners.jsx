import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png'; // Adjust the path according to your file structure

const Partners = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://localhost:4000/partners');
        // const data = response.data;

        // Dummy data since the endpoint is not available
        const data = [
          {
            organizationName: "Test NGO",
            email: "test@ngo.com",
            website: "www.testngo.com",
            contactNumber: "0748800714",
            location: "Nairobi",
            organizationType: "NGO",
            reasonForPartnership: "Reason for partnership",
          },
          {
            organizationName: "Test Organization",
            email: "contact@testorg.com",
            website: "www.testorg.com",
            contactNumber: "0712345678",
            location: "Mombasa",
            organizationType: "Corporation",
            reasonForPartnership: "Expand outreach programs",
          },
          {
            organizationName: "Charity Group",
            email: "info@charitygroup.org",
            website: "www.charitygroup.org",
            contactNumber: "0722334455",
            location: "Kisumu",
            organizationType: "Charity",
            reasonForPartnership: "Collaborate on charity events",
          }
        ];

        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add the organization logo
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Add title
    doc.setFontSize(18);
    doc.text("Partnership Requests", 10, 40);

    // Reset color and add current date
    doc.setTextColor(0);
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 10, 50);

    // Add the table
    doc.autoTable({
      startY: 60,
      head: [['Organization Name', 'Email', 'Website', 'Contact Number', 'Location', 'Type', 'Reason']],
      body: partners.map(p => [
        p.organizationName, p.email, p.website, p.contactNumber, p.location, p.organizationType, p.reasonForPartnership
      ]),
    });

    doc.save("Partnership_Requests.pdf");
  };

  return (
    <div className="p-8">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Partnership Requests</h1>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Organization Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Website</th>
            <th className="py-2 px-4 border">Contact Number</th>
            <th className="py-2 px-4 border">Location</th>
            <th className="py-2 px-4 border">Type</th>
            <th className="py-2 px-4 border">Reason</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{partner.organizationName}</td>
              <td className="py-2 px-4 border">{partner.email}</td>
              <td className="py-2 px-4 border">{partner.website}</td>
              <td className="py-2 px-4 border">{partner.contactNumber}</td>
              <td className="py-2 px-4 border">{partner.location}</td>
              <td className="py-2 px-4 border">{partner.organizationType}</td>
              <td className="py-2 px-4 border">{partner.reasonForPartnership}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-[#006D5B] text-white p-2 mt-4 rounded hover:bg-[#004d40]"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Partners;
