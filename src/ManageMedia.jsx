import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const MEDIA_URL = "https://arkad-server.onrender.com/users/media";
const key = process.env.REACT_APP_SECRET_KEY;

const ManageMedia = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  const menuRef = useRef(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if (token) getMedia();
  }, [token]);

  const getMedia = async () => {
    if (!token || !key) return;
    setLoading(true);

    try {
      const response = await axios.get(MEDIA_URL, {
        headers: { Authorization: `Bearer ${token}` },
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

        const decryptedMedia = JSON.parse(decryptedData);
        setMediaItems(decryptedMedia.length > 0 ? decryptedMedia : []);
      }
    } catch (error) {
      console.error('Error getting media:', error);
      setMessage('Error fetching media: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async (id) => {
    if(!token) return;
    setIsLoading(true);
    try {
      if (window.confirm('Are you sure you want to delete this media item? This action is irreversible.')) {
        await axios.delete(`${MEDIA_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        getMedia()
      }
    } catch (error) {
      console.error('Error deleting media:', error);
    } finally{
      setIsLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mediaItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mediaItems.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Media
      </h1>
      {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}
      {loading ? (
        <div className="text-center">Loading Media...</div>
      ) : (
        mediaItems.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Images</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">
                    <div className="flex flex-wrap">
                      {item.media.map((image, index) => (
                        <div key={index} className="relative mr-2 mb-2">
                          <img
                            src={image}
                            alt="Media"
                            className="w-20 h-20 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    {item.description}
                  </td>
                  <td className="py-2 px-4 border relative">
                    <button
                      onClick={() => setOpenMenuId(item.id)}
                      className="bg-gray-200 px-4 py-2 rounded"
                    >
                      ⋮
                    </button>
                    {openMenuId === item.id && (
                      <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                        >
                          {isLoading? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No media items found.</div>
        )
      )}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-1 bg-[#006D5B] text-white rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-1 bg-[#006D5B] text-white rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageMedia;
