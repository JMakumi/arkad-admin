import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png'; // Assuming you have a logo in this path

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    // Fetch the donation data (using dummy data here for demonstration)
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://localhost:4000/donations');
        // const data = response.data;

        // Dummy data since the endpoint is not available
        const data = [
          { fullName: 'John Doe', email: 'johndoe@example.com', phoneNumber: '0748800714', type: 'MPESA', amount: '5000', transactionCode: 'XYZ123', status: 'pending', date: '2024-08-30 14:30:00' },
          { fullName: 'Jane Smith', email: 'janesmith@example.com', phoneNumber: '0748800715', type: 'RTGS', amount: '10000', transactionCode: 'XYZ124', status: 'completed', date: '2024-08-29 10:45:00' },
          { fullName: 'Alice Johnson', email: 'alicejohnson@example.com', phoneNumber: '0748800716', type: 'Airtel Money', amount: '2500', transactionCode: 'XYZ125', status: 'pending', date: '2024-08-28 09:15:00' },
          { fullName: 'Bob Brown', email: 'bobbrown@example.com', phoneNumber: '0748800717', type: 'Bank', amount: '20000', transactionCode: 'XYZ126', status: 'completed', date: '2024-08-27 16:00:00' },
        ];

        setDonations(data);
      } catch (error) {
        console.error('Error fetching donations:', error);
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
    doc.text(`${currentMonth}, ${currentYear} Donations`, 10, 40);

    // Add the table
    doc.autoTable({
      startY: 50,
      head: [['Full Name', 'Email', 'Phone Number', 'Type', 'Amount', 'Transaction Code', 'Status', 'Date']],
      body: donations.map(d => [d.fullName, d.email, d.phoneNumber, d.type, d.amount, d.transactionCode, d.status, d.date]),
    });

    doc.save(`${currentMonth}_${currentYear}_Donations.pdf`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">{currentMonth}, {currentYear} Donations</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Full Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone Number</th>
            <th className="py-2 px-4 border">Type</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Transaction Code</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{donation.fullName}</td>
              <td className="py-2 px-4 border">{donation.email}</td>
              <td className="py-2 px-4 border">{donation.phoneNumber}</td>
              <td className="py-2 px-4 border">{donation.type}</td>
              <td className="py-2 px-4 border">{donation.amount}</td>
              <td className="py-2 px-4 border">{donation.transactionCode}</td>
              <td className="py-2 px-4 border">{donation.status}</td>
              <td className="py-2 px-4 border">{donation.date}</td>
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
    </div>
  );
};

export default Donations;
