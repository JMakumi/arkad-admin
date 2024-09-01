import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MESSAGES_URL = "https://arkad-server.onrender.com/users/messages"

const ContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState("");

  useEffect(()=>{
    const storedAccessToken = localStorage.getItem('accessToken');
    if(storedAccessToken) setToken(JSON.parse(storedAccessToken))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const response = await axios.get(MESSAGES_URL,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if(response.data.success){
          const ciphertext = response.data.ciphertext;
          const iv = response.data.iv
          setMessages();
        }

        setMessages();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`https://localhost:4000/contact-us/${id}`, { status: 'read' });
      alert('Message marked as read!');
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-[#006D5B] mb-4">Messages</h1>
      </div>
      <div className="overflow-x-auto">
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
      </div>
    </div>
  );
};

export default ContactUs;
