import React, { useEffect, useState } from 'react';

const USERS_URL = 'https://arkad-server.onrender.com/users/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem("userData");
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
    if (userData) setUserId(JSON.parse(userData).id);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch(USERS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        if (data.success) {
          const filteredUsers = data.data.filter(user => user.id !== userId);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, userId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure? This action is permanent.');
    if (!confirmed) return;
    if (!token || !id) return;
    setLoadingDeleteId(id);

    try {
      const response = await fetch(`${USERS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
        setUsers(users.filter(user => user.id !== id));
      } else {
        setMessage(result.message || "Failed to delete the user");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage("An error occurred while deleting the user");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading users...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Management</h2>
      
      {message && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">First Name</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Last Name</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Username</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Role</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Created At</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Updated At</th>
              <th className="px-4 py-2 border-b border-gray-200 text-left font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                <td className="px-4 py-2 border-b border-gray-200">{user.id}</td>
                <td className="px-4 py-2 border-b border-gray-200">{user.firstName}</td>
                <td className="px-4 py-2 border-b border-gray-200">{user.lastName}</td>
                <td className="px-4 py-2 border-b border-gray-200">{user.username}</td>
                <td className="px-4 py-2 border-b border-gray-200">{user.role}</td>
                <td className="px-4 py-2 border-b border-gray-200">{user.status}</td>
                <td className="px-4 py-2 border-b border-gray-200">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                    {new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>

                <td className="px-4 py-2 border-b border-gray-200">
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={loadingDeleteId === user.id}
                    className={`px-4 py-2 text-white rounded ${
                      loadingDeleteId === user.id
                        ? 'bg-red-300 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    } transition duration-200 ease-in-out`}
                  >
                    {loadingDeleteId === user.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
