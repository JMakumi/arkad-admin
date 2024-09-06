import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js'; 

const MESSAGES_URL = "https://arkad-server.onrender.com/users/message";
const key = process.env.REACT_APP_SECRET_KEY;

const ContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [token, setToken] = useState("");

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
    try {
      const response = await axios.get(MESSAGES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
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

        const decryptedMessages = JSON.parse(decryptedData);
        setMessages(decryptedMessages.length > 0 ? decryptedMessages : []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);  
    }
  };

  const handleMarkAsRead = async (id) => {
    if (!token || !id) return;
    
    // Temporarily hide the message
    const updatedMessages = messages.filter(msg => msg.id !== id);
    setMessages(updatedMessages);

    try {
      const response = await axios.put(`${MESSAGES_URL}/${id}`, { status: "read" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.data.success) {
        // If the request fails, re-add the message back to the list
        const originalMessage = messages.find(msg => msg.id === id);
        setMessages([...updatedMessages, originalMessage]);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      // On error, re-add the message back to the list
      const originalMessage = messages.find(msg => msg.id === id);
      setMessages([...updatedMessages, originalMessage]);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#006D5B]"></div>
        </div>
      )} 
      
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Messages</h1>
      </div>

      <div className="overflow-x-auto">
        {messages.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Full Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone Number</th>
                <th className="py-2 px-4 border">Message</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td className="py-2 px-4 border whitespace-nowrap">{msg.fullName}</td>
                  <td className="py-2 px-4 border">{msg.email}</td>
                  <td className="py-2 px-4 border">{msg.phoneNumber}</td>
                  <td className="py-2 px-4 border">{msg.message}</td>
                  <td className="py-2 px-4 border">{msg.status}</td>
                  <td className="py-2 px-4 border">
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40] whitespace-nowrap"
                      >
                        Mark as Read
                      </button>
                    )}
                    {msg.status === 'read' && <span>Read</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center">
            <p>No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
