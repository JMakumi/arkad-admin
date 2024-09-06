import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import CryptoJS from 'crypto-js';
import 'jspdf-autotable';
import logo from './images/logo.png'; 

const PARTNER_URL = "https://arkad-server.onrender.com/users/partners";
const key = process.env.REACT_APP_SECRET_KEY;

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");  
  const [loading, setLoading] = useState(false); 
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  const fetchData = async () => {
    if (!start || !end) {
      setMessage('Please provide both start and end dates.');
      setTimeout(() => setMessage(""), 5000);
      return;
    }
    if (!token || !key) return;
    setLoading(true);
    const payload ={ start, end }
    try {
      const response = await fetch(PARTNER_URL, { 
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json()
      if (result.success) {
        const { ciphertext, iv } = result.data;
        console.log(ciphertext, iv);
        const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
          iv: CryptoJS.enc.Hex.parse(iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const decryptedMessages = JSON.parse(decryptedData);
        setPartners(decryptedMessages.length > 0 ? decryptedMessages : []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      setMessage('Error fetching members: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };
  

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
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-[#006D5B] mb-8 text-center">
            Partnership Requests
          </h1>

          {message && (
            <div className="mb-4 p-4 text-white bg-red-500 rounded">
              {message}
            </div>
          )}

          <div className="flex flex-col items-center space-y-6 mb-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex flex-col items-center">
                <label htmlFor="start" className="text-gray-700 font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  className="border rounded-lg p-2 shadow-sm focus:outline-none focus:ring focus:border-[#006D5B]"
                  required
                />
              </div>

              <div className="flex flex-col items-center">
                <label htmlFor="end" className="text-gray-700 font-semibold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="end"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  className="border rounded-lg p-2 shadow-sm focus:outline-none focus:ring focus:border-[#006D5B]"
                  required
                />
              </div>
            </div>

            <button
              onClick={fetchData}
              className="bg-[#006D5B] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-300"
            >
              {loading ? "Getting Partners..." : "Get Partners"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}

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
