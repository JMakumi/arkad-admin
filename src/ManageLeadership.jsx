import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';

const LEADERSHIP_URL = "https://arkad-server.onrender.com/users/leaders";

const ManageLeadership = () => {
  const [leadership, setLeadership] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editedLeadership, setEditedLeadership] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const menuRef = useRef(null);
  
  const itemsPerPage = 5; 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  useEffect(() => {
    if(token) fetchData();
  }, [token]);

  const fetchData = async () => {
    if(!token) return;
    setLoading(true);
    try {
      const response = await fetch(LEADERSHIP_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const res = await response.json();
      
      if(res.success){
        setLeadership(res.data);
      }else{
        setMessage("You have no leaders yet");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      setMessage(`There was an error: ${error}`);
      setTimeout(() => setMessage(""), 5000);
    } finally{
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
          maxSizeMB: 0.4, 
          maxWidthOrHeight: 800, 
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
    if (!token) return;
    setIsLoading(true);
    try {
      const dataToUpdate = editedLeadership[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) {
        formData.append(key, value);
      }

      // Encrypt the name, role, and description
      const { name, role, description } = dataToUpdate;

      formData.set('name', name);
      formData.set('role', role);
      formData.set('description', description);

      const response = await fetch(`${LEADERSHIP_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify(formData)
      });

      const res = await response.json();

      if(res.success){
        fetchData()
        setIsEditing({});
        setEditedLeadership((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setOpenMenuId(null);
      }
      
    } catch (error) {
      console.error('Error updating leadership member:', error);
    } finally{
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    setIsLoading(true);
    try {
      if (window.confirm('Are you sure you want to delete this leader? This action is irreversible.')) {
        const response = await fetch(`${LEADERSHIP_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = await response.json();

        if(res.success){
          setLeadership((prev) => prev.filter((item) => item.id !== id));
          fetchData()
        }
      }
    } catch (error) {
      console.error('Error deleting leader:', error);
    } finally{
      setIsLoading(false);
    }
  };

  const proceedWithEdit = () => {
    startEditing(pendingEditId);
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leadership.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leadership.length / itemsPerPage);

  return (
        <div className="p-8">
          <h1 className="text-2xl font-bold flex justify-center items-center text-[#006D5B] mb-4">
            Manage Leadership
          </h1>
          {message && <div className="mb-4 p-4 text-white bg-green-500 rounded">{message}</div>}
          {loading? (
            <div className="text-center">Loading Leaders...</div>
          ):(
            leadership.length>0? (
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
                            {isLoading? "Sending..." : "Submit"}
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
                                  {isLoading? "Deleting..." : "Delete"}
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
            ):(
              <div>No Leaders Found</div>
            )
          )}
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
