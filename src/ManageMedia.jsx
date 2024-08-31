import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import image from './images/impact.jpg';
import image2 from './images/happy.jpg';

const ManageMedia = () => {
  const dummyData = [
    {
      id: 1,
      images: [image, image2, image, image2],
      description: 'Description 1',
    },
    {
      id: 2,
      images: [image, image2, image],
      description: 'Description 2',
    },
    {
      id: 3,
      images: [image, image2, image, image2],
      description: 'Description 3',
    },
    {
      id: 4,
      images: [image, image2, image2],
      description: 'Description 4',
    },
    {
      id: 5,
      images: [image, image2],
      description: 'Description 5',
    },
    {
      id: 6,
      images: [image, image2],
      description: 'Description 6',
    },
    {
      id: 7,
      images: [image, image2],
      description: 'Description 7',
    },
    {
      id: 8,
      images: [image, image2],
      description: 'Description 8',
    },
  ];

  const [mediaItems, setMediaItems] = useState(dummyData);
  const [isEditing, setIsEditing] = useState({});
  const [editedMediaItems, setEditedMediaItems] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const menuRef = useRef(null);

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

        const updatedImages = [...mediaItems.find((item) => item.id === id).images];
        updatedImages[index] = URL.createObjectURL(newImageFile);

        handleInputChange(id, 'images', updatedImages);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSubmit = async (id) => {
    try {
      const dataToUpdate = editedMediaItems[id];
      const formData = new FormData();
      for (const [key, value] of Object.entries(dataToUpdate)) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => formData.append(`${key}[${index}]`, item));
        } else {
          formData.append(key, value);
        }
      }

      console.log('Data to be updated:', formData);

      alert('Media updated successfully!');
      setIsEditing({}); // Close the edit mode
      setEditedMediaItems((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setOpenMenuId(null); // Reset menu state
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const handleDelete = (id) => {
    try {
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      alert('Media deleted successfully!');
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
                  {item.images.map((image, index) => (
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
                      editedMediaItems[item.id]?.description ||
                      item.description
                    }
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        'description',
                        e.target.value
                      )
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
                      &#x22EE;
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Editing in progress</h2>
            <p className="mb-4">You are currently editing another media item. Do you want to proceed and discard unsaved changes?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black p-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithEdit}
                className="bg-red-600 text-white p-2 rounded"
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

export default ManageMedia;
