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

  // Fetch users on component mount
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
          // Filter out the current logged-in user
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

  // Delete user function
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

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>User Management</h2>
      {message && <p>{message}</p>} 
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  style={{ color: 'red' }} 
                  disabled={loadingDeleteId === user.id}
                >
                  {loadingDeleteId === user.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
