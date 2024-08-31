import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import pexels from './images/pexels-jairo-david-arboleda-621072-1425883.jpg';

const ManageAchievements = () => {
  const dummyData = [
    {
      id: 1,
      image: pexels,
      description: 'Description 1',
      venue: 'Place 1',
      date: '2024-07-20',
    },
    {
      id: 2,
      image: pexels,
      description: 'Description 2',
      venue: 'Place 2',
      date: '2024-07-21',
    },
    {
      id: 3,
      image: pexels,
      description: 'Description 3',
      venue: 'Place 3',
      date: '2024-07-22',
    },
    {
      id: 4,
      image: pexels,
      description: 'Description 4',
      venue: 'Place 4',
      date: '2024-07-23',
    },
    {
        id: 5,
        image: pexels,
        description: 'Description 1',
        venue: 'Place 1',
        date: '2024-07-20',
      },
      {
        id: 6,
        image: pexels,
        description: 'Description 2',
        venue: 'Place 2',
        date: '2024-07-21',
      },
      {
        id: 7,
        image: pexels,
        description: 'Description 3',
        venue: 'Place 3',
        date: '2024-07-22',
      },
      {
        id: 8,
        image: pexels,
        description: 'Description 4',
        venue: 'Place 4',
        date: '2024-07-23',
      },
      {
        id: 9,
        image: pexels,
        description: 'Description 1',
        venue: 'Place 1',
        date: '2024-07-20',
      },
      {
        id: 10,
        image: pexels,
        description: 'Description 2',
        venue: 'Place 2',
        date: '2024-07-21',
      },
      {
        id: 11,
        image: pexels,
        description: 'Description 3',
        venue: 'Place 3',
        date: '2024-07-22',
      },
      {
        id: 12,
        image: pexels,
        description: 'Description 4',
        venue: 'Place 4',
        date: '2024-07-23',
      },
  ];

  const [activities, setActivities] = useState(dummyData);
  const [isEditing, setIsEditing] = useState({});
  const [editedActivities, setEditedActivities] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const menuRef = useRef(null);

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

      console.log('Data to be updated:', formData);
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

  const handleDelete = (id) => {
    try {
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
      alert('Activity deleted successfully!');
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);

  // Determine the total number of pages
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Achievements
      </h1>
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
                      editedActivities[activity.id]?.venue || activity.venue
                    }
                    onChange={(e) =>
                      handleInputChange(activity.id, 'venue', e.target.value)
                    }
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
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 font-bold"
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <span className="text-gray-700">
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

      {/* Modal for warning before discarding edits */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Discard Current Edit?
            </h2>
            <p className="mb-6">
              You have unsaved changes. Do you want to discard them and edit a
              different activity?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithEdit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Discard and Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAchievements;
