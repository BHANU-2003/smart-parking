import React, { useEffect, useState } from 'react';
import { Users, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-500 mt-1">View and manage registered users</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created At</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Password</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-600">{user.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      {showPasswords[user.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;