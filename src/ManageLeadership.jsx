import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import image from './images/test.jpg'; // Dummy image path

const ManageLeadership = () => {
  const [leadership, setLeadership] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editedLeadership, setEditedLeadership] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const menuRef = useRef(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API call
        const response = await axios.get('/api/leadership');
        setLeadership(response.data);
      } catch (error) {
        console.error('Error fetching leadership:', error);
        // Use dummy data if fetching fails
        setLeadership([
          {
            id: 1,
            image: image,
            name: "John Doe",
            role: "Founder and CEO",
            description: "Studied at XYZ, worked at TVS, but rides Bajaj",
          },
          {
            id: 2,
            image: image,
            name: "Jane Doe",
            role: "Co-Founder and Strategic Partnerships Director",
            description: "Studied at XYZ, Mama mboga, but rides TVS",
          },
          {
            id: 3,
            image: image,
            name: "Kanda Bondoman",
            role: "Co-Founder and Organizing Director",
            description: "Studied at XYZ, has never succeeded in anything, owns nothing",
          },
        ]);
      }
    };

    fetchData();
  }, []);

  // Handle click outside to close the dropdown
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
    setEditedLeadership((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageChange = async (id, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.4, // Max file size in MB (400 KB)
          maxWidthOrHeight: 800, // Max width or height
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const newImageFile = new File([compressedFile], file.name, {
          type: file.type,
        });

        handleInputChange(id, 'image', newImageFile);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSubmit = async (id) => {
    try {
      const dataToUpdate = editedLeadership[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) {
        formData.append(key, value);
      }

      // Replace with your API call
      await axios.put(`/api/leadership/${id}`, formData);

      alert('Leadership updated successfully!');
      setIsEditing({}); // Close the edit mode
      setEditedLeadership((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setOpenMenuId(null); // Reset menu state
    } catch (error) {
      console.error('Error updating leadership:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Replace with your API call
      await axios.delete(`/api/leadership/${id}`);
      setLeadership((prev) => prev.filter((item) => item.id !== id));
      alert('Leadership deleted successfully!');
      setOpenMenuId(null); // Close the menu after deletion
    } catch (error) {
      console.error('Error deleting leadership:', error);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leadership.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leadership.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Leadership
      </h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border">
                {isEditing[item.id] ? (
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(item.id, e)}
                    accept="image/*"
                  />
                ) : (
                  <img
                    src={item.image}
                    alt="Leadership"
                    className="w-20 h-20 object-cover"
                  />
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing[item.id] ? (
                  <input
                    type="text"
                    value={
                      editedLeadership[item.id]?.name || item.name
                    }
                    onChange={(e) =>
                      handleInputChange(item.id, 'name', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing[item.id] ? (
                  <input
                    type="text"
                    value={
                      editedLeadership[item.id]?.role || item.role
                    }
                    onChange={(e) =>
                      handleInputChange(item.id, 'role', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  item.role
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing[item.id] ? (
                  <input
                    type="text"
                    value={
                      editedLeadership[item.id]?.description || item.description
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
              <td className="py-2 px-4 border relative">
                {isEditing[item.id] ? (
                  <button
                    onClick={() => handleSubmit(item.id)}
                    className="bg-[#006D5B] text-white p-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === item.id ? null : item.id
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      &#x22EE; {/* Unicode for vertical ellipsis */}
                    </button>

                    {openMenuId === item.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10"
                      >
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="mb-4">You have unsaved changes. Proceed and lose them?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithEdit}
                className="bg-red-600 text-white px-4 py-2 rounded"
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

export default ManageLeadership;
