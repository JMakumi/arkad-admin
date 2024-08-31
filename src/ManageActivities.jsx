import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; 
import image from './images/memories.jpg'

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editedActivities, setEditedActivities] = useState({});
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
        const response = await axios.get('/api/activities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Use dummy data if fetching fails
        setActivities([
          {
            id: 1,
            image: image,
            description: 'Description 1',
            location: 'Place 1',
            date: '2024-07-20',
          },
          {
            id: 2,
            image: image,
            description: 'Description 2',
            location: 'Place 2',
            date: '2024-07-21',
          },
          {
            id: 3,
            image: image,
            description: 'Description 3',
            location: 'Place 3',
            date: '2024-07-22',
          },
          {
            id: 4,
            image: image,
            description: 'Description 4',
            location: 'Place 4',
            date: '2024-07-23',
          },
          {
            id: 5,
            image: image,
            description: 'Description 5',
            location: 'Place 5',
            date: '2024-07-24',
          },
          {
            id: 6,
            image: image,
            description: 'Description 6',
            location: 'Place 6',
            date: '2024-07-25',
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
    setEditedActivities((prev) => ({
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
      const dataToUpdate = editedActivities[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) {
        formData.append(key, value);
      }

      // Replace with your API call
      await axios.put(`/api/activities/${id}`, formData);

      alert('Activity updated successfully!');
      setIsEditing({}); // Close the edit mode
      setEditedActivities((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setOpenMenuId(null); // Reset menu state
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Replace with your API call
      await axios.delete(`/api/activities/${id}`);
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
      alert('Activity deleted successfully!');
      setOpenMenuId(null); // Close the menu after deletion
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Activities
      </h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Location</th>
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
                    value={
                      editedActivities[activity.id]?.description ||
                      activity.description
                    }
                    onChange={(e) =>
                      handleInputChange(
                        activity.id,
                        'description',
                        e.target.value
                      )
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
                    value={
                      editedActivities[activity.id]?.location || activity.location
                    }
                    onChange={(e) =>
                      handleInputChange(activity.id, 'location', e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  activity.location
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing[activity.id] ? (
                  <input
                    type="date"
                    value={
                      editedActivities[activity.id]?.date || activity.date
                    }
                    onChange={(e) =>
                      handleInputChange(activity.id, 'date', e.target.value)
                    }
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
                    className="bg-[#006D5B] text-white p-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === activity.id ? null : activity.id
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      &#x22EE; {/* Unicode for vertical ellipsis */}
                    </button>

                    {openMenuId === activity.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10"
                      >
                        <button
                          onClick={() => handleEdit(activity.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
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

export default ManageActivities;
