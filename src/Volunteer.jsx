import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './images/logo.png';
import "./modal.css";

const VOLUNTEER_URL = "https://arkad-server.onrender.com/users/volunteer";

const Volunteer = () => {
  const [activities, setActivities] = useState([]);  // Store the activity and volunteer data
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(VOLUNTEER_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success) {
        setActivities(result.data || []);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setMessage('Error fetching achievements: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);

    doc.setFontSize(18);
    doc.text("Volunteers Data", 10, 40);

    activities.forEach((activity, index) => {
      // Each activity will start with a merged row for the activity title
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + (index === 0 ? 20 : 10), // Adjusts spacing for the first activity
        head: [[activity.activityTitle]], // Display only the activity title in the header row
        theme: 'plain',
        styles: { fontSize: 14, textColor: [0, 112, 90] }, // Style for the activity title
        columnStyles: { 0: { halign: 'left' } },
        margin: { left: 10 },
      });

      // Display volunteer data for each activity
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 5,
        head: [['Full Name', 'Phone Number', 'Email']],
        body: activity.volunteers.map((volunteer) => [
          volunteer.fullName,
          volunteer.phoneNumber,
          volunteer.email,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 109, 91] },
        margin: { left: 10 },
      });
    });

    doc.save('Volunteers_Data.pdf');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Volunteers Data</h1>
      
      {loading ? (
        <div className="loading-bubble-wrapper">
          <div className="loading-bubble"></div>
          <p className="loading-text">Fetching Volunteers for you...</p>
        </div>
      ) : (
        <>
          {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}

          {activities.length > 0 ? (
            <>
              <table className="min-w-full bg-white border mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Activity</th>
                    <th className="py-2 px-4 border">Full Name</th>
                    <th className="py-2 px-4 border">Phone Number</th>
                    <th className="py-2 px-4 border">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, activityIndex) => (
                    <React.Fragment key={activityIndex}>
                      <tr>
                        <td className="py-2 px-4 border font-bold text-[#006D5B]" rowSpan={activity.volunteers.length + 1}>
                          {activity.activityTitle}
                        </td>
                      </tr>
                      {activity.volunteers.map((volunteer, volunteerIndex) => (
                        <tr key={volunteerIndex}>
                          <td className="py-2 px-4 border">{volunteer.fullName}</td>
                          <td className="py-2 px-4 border">{volunteer.phoneNumber}</td>
                          <td className="py-2 px-4 border">{volunteer.email}</td>
                        </tr>
                      ))}
                    </React.Fragment>
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
          ) : (
            <div className="text-xl text-red-500">No activities available.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Volunteer;
