import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';
import CryptoJS from 'crypto-js';
import "./modal.css";

const VOLUNTEER_URL = "https://arkad-server.onrender.com/users/volunteer";
const key = process.env.REACT_APP_SECRET_KEY;

const Volunteer = () => {
  const [activities, setActivities] = useState([]);  // Store the activity and volunteer data
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token || !key) return;
    setLoading(true);  // Set loading to true when data is being fetched
    try {
      const response = await fetch(VOLUNTEER_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success) {
        const { ciphertext, iv } = response.data.data;
        const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
          iv: CryptoJS.enc.Hex.parse(iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');

        const decryptedActivities = JSON.parse(decryptedData);
        setActivities(decryptedActivities.length > 0 ? decryptedActivities : []);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setMessage('Error fetching achievements: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);  // Data fetch is complete, loading should be set to false
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add the organization logo
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    // Add title
    doc.setFontSize(18);
    doc.text(`${selectedActivity.activityTitle} Volunteers`, 10, 40);

    // Add the table
    doc.autoTable({
      startY: 50,
      head: [['Full Name', 'Phone Number', 'Email', 'Location']],
      body: selectedActivity.volunteers.map(v => [v.fullName, v.phoneNumber, v.email, v.location]),
    });

    doc.save(`${selectedActivity.activityTitle}_Volunteers.pdf`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Volunteers Data</h1>
      
      {/* Display a loading message if the data is being fetched */}
      {loading ? (
        <div className="loading-bubble-wrapper">
          <div className="loading-bubble"></div>
          <p className="loading-text">Fetching Volunteers for you...</p>
      </div>
      ) : (
        <>
          {/* Show message if it exists */}
          {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}

          {/* Render buttons for activities only if there is data */}
          {activities.length > 0 ? (
            <div className="mb-4">
              {activities.map((activity, index) => (
                <button
                  key={index}
                  onClick={() => handleActivityClick(activity)}
                  className="bg-[#006D5B] text-white p-2 m-2 rounded hover:bg-[#004d40]"
                >
                  {activity.activityTitle}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xl text-red-500">No activities available.</div>
          )}

          {/* Render volunteer data if an activity is selected */}
          {selectedActivity && (
            <>
              <h2 className="text-xl font-bold text-[#006D5B] mb-2">{selectedActivity.activityTitle} Volunteers</h2>
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
                  {selectedActivity.volunteers.map((volunteer, index) => (
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
        </>
      )}
    </div>
  );
};

export default Volunteer;
