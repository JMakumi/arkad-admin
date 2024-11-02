import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';

const ACTIVITIES_URL = "https://arkad-server.onrender.com/users/activities";

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
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const menuRef = useRef(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if (token) fetchActivities();
  }, [token]);

  const fetchActivities = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const response = await fetch(ACTIVITIES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
      }else{
        setMessage("You have no upcoming events currently");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error getting achievements:', error);
      setMessage('You have no upcoming events currently');
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
    if(!token) return;
    setIsLoading(true);
    try {
      const dataToUpdate = editedActivities[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) formData.append(key, value);

      // Encrypt the title, venue, and date
      const { title, venue, date } = dataToUpdate;

      formData.set('title', title);
      formData.set('venue', venue);
      formData.set('date', date);

      const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if(result.success){
        fetchActivities()
        setIsEditing({});
        setEditedActivities((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
    }finally{
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!token) return;
    setIsLoading(true);
    try {
      if (window.confirm('Are you sure you want to delete this achievement? This action is irreversible.')) {
        const response = await fetch(`${ACTIVITIES_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if(result.success){
          setActivities((prev) => prev.filter((activity) => activity.id !== id));
          fetchActivities();
        }
        
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally{
      setIsLoading(false);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
        Manage Activities
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
                <th className="py-2 px-4 border">Title</th>
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
                        value={editedActivities[activity.id]?.title || activity.title}
                        onChange={(e) =>
                          handleInputChange(activity.id, 'title', e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      activity.title
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
                        max={getTodayDate()}
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
                        {isLoading? "Sending..." : "Submit"}
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
                              {isLoading? "Deleting..." : "Delete"}
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
          <div>No Activities Found</div>
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
