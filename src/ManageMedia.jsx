import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import CryptoJS from 'crypto-js';

const MEDIA_URL = "https://arkad-server.onrender.com/users/media";
const key = process.env.REACT_APP_SECRET_KEY;

const ManageMedia = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editedMediaItems, setEditedMediaItems] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
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
    setEditedMediaItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageChange = async (id, index, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const newImageFile = new File([compressedFile], file.name, {
          type: file.type,
        });

        const updatedImages = [...mediaItems.find((item) => item.id === id).media];
        updatedImages[index] = URL.createObjectURL(newImageFile);

        handleInputChange(id, 'media', updatedImages);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const encryptData = (data) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return {
      ciphertext: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Hex),
    };
  };

  const handleSubmit = async (id) => {
    try {
      const dataToUpdate = editedMediaItems[id];
      const encryptedData = encryptData(dataToUpdate);

      const response = await axios.put(`${MEDIA_URL}/${id}`, encryptedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert('Media updated successfully!');
        setIsEditing({}); // Close the edit mode
        setEditedMediaItems((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setOpenMenuId(null); // Reset menu state
        getMedia(); // Reload updated media
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${MEDIA_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Media deleted successfully!');
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      setOpenMenuId(null); // Close the menu after deletion
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
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
                          {isEditing[item.id] ? (
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(item.id, index, e)}
                              accept="image/*"
                            />
                          ) : (
                            <img
                              src={image}
                              alt="Media"
                              className="w-20 h-20 object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    {isEditing[item.id] ? (
                      <input
                        type="text"
                        value={
                          editedMediaItems[item.id]?.description || item.description
                        }
                        onChange={(e) =>
                          handleInputChange(item.id, 'description', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === item.id ? null : item.id))
                        }
                        className="text-2xl px-2 py-1"
                      >
                        &#x22EE; {/* Three-dotted vertical menu */}
                      </button>
                      {openMenuId === item.id && (
                        <div
                          className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded-lg shadow-xl z-10"
                          ref={menuRef}
                        >
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="block px-4 py-2 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="block px-4 py-2 w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No media items found.</div>
        )
      )}

      {/* Save button */}
      {Object.values(isEditing).some((edit) => edit) && (
        <div className="text-center mt-4">
          <button
            onClick={() => handleSubmit(pendingEditId)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${
              currentPage === index + 1
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-black'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
            <p>You have unsaved changes. Do you want to continue?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithEdit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMedia;
