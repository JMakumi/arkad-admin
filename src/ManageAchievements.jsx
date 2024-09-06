import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import imageCompression from 'browser-image-compression';

const ACHIEVEMENTS_URL = "https://arkad-server.onrender.com/users/achievement";
const key = process.env.REACT_APP_SECRET_KEY;

const ManageAchievements = () => {
  const [activities, setActivities] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editedActivities, setEditedActivities] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const menuRef = useRef(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if (token) getAchievements();
  }, [token]);

  const getAchievements = async () => {
    if (!token || !key) return;
    setLoading(true);

    try {
      const response = await axios.get(ACHIEVEMENTS_URL, {
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

        const decryptedMembers = JSON.parse(decryptedData);
        setActivities(decryptedMembers.length > 0 ? decryptedMembers : []);
      }
    } catch (error) {
      console.error('Error getting achievements:', error);
      setMessage('Error fetching achievements: ' + error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    if (Object.values(isEditing).some((edit) => edit)) {
      setPendingEditId(id);
      setShowModal(true);
    } else {
      startEditing(id);
    }
  };

  const startEditing = (id) => {
    setIsEditing({ [id]: true });
    setOpenMenuId(null);
  };

  const handleInputChange = (id, field, value) => {
    setEditedActivities((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageChange = async (id, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = { maxSizeMB: 0.4, maxWidthOrHeight: 800, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const newImageFile = new File([compressedFile], file.name, { type: file.type });
        handleInputChange(id, 'image', newImageFile);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSubmit = async (id) => {
    try {
      const dataToUpdate = editedActivities[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) formData.append(key, value);

      // Encrypt the description, venue, and date
      const { description, venue, date } = dataToUpdate;
      const dataStr = JSON.stringify({ description, venue, date });
      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Hex.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }).toString();

      formData.set('iv', iv);
      formData.set('ciphertext', encryptedData);

      await axios.put(`${ACHIEVEMENTS_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      alert('Activity updated successfully!');
      setIsEditing({});
      setEditedActivities((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this achievement? This action is irreversible.')) {
        await axios.delete(`${ACHIEVEMENTS_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
        alert('Activity deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Achievements
      </h1>
      {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}
      {loading ? (
        <div className="text-center">Loading Achievements...</div>
      ) : (
        activities.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Venue</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((activity) => (
                <tr key={activity.id}>
                  <td className="py-2 px-4 border">
                    {isEditing[activity.id] ? (
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(activity.id, e)}
                        accept="image/*"
                      />
                    ) : (
                      <img
                        src={activity.image}
                        alt="Activity"
                        className="w-20 h-20 object-cover"
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {isEditing[activity.id] ? (
                      <input
                        type="text"
                        value={editedActivities[activity.id]?.description || activity.description}
                        onChange={(e) =>
                          handleInputChange(activity.id, 'description', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      activity.description
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {isEditing[activity.id] ? (
                      <input
                        type="text"
                        value={editedActivities[activity.id]?.venue || activity.venue}
                        onChange={(e) => handleInputChange(activity.id, 'venue', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      activity.venue
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {isEditing[activity.id] ? (
                      <input
                        type="date"
                        value={editedActivities[activity.id]?.date || activity.date}
                        onChange={(e) => handleInputChange(activity.id, 'date', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      activity.date
                    )}
                  </td>
                  <td className="py-2 px-4 border relative">
                    {isEditing[activity.id] ? (
                      <button
                        onClick={() => handleSubmit(activity.id)}
                        className="bg-[#006D5B] text-white p-2 rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          className="text-gray-500"
                          onClick={() =>
                            setOpenMenuId(openMenuId === activity.id ? null : activity.id)
                          }
                        >
                          &#8942;
                        </button>
                        {openMenuId === activity.id && (
                          <ul
                            ref={menuRef}
                            className="absolute right-0 bg-white border rounded shadow-lg py-2 w-32 z-10"
                          >
                            <li
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleEdit(activity.id)}
                            >
                              Edit
                            </li>
                            <li
                              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleDelete(activity.id)}
                            >
                              Delete
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No Achievements Found</div>
        )
      )}

      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <p>You have unsaved changes. Do you want to discard them?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#006D5B] text-white px-4 py-2 rounded"
                onClick={proceedWithEdit}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAchievements;
