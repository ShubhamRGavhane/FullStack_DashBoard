"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const APIURL = "http://127.0.0.1:5001/fullstack-dashboard-5e7c4/us-central1/api";

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [newUser, setNewUser] = useState<User>({ id: "", name: "", email: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIURL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return;

    setLoading(true);
    try {
      const response = await axios.post(`${APIURL}/users`, newUser);
      setUsers([...users, response.data.user]);
      setNewUser({ id: "", name: "", email: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string) => {
    if (!editingUser || !editingUser.name || !editingUser.email) return;

    setLoading(true);
    try {
      await axios.put(`${APIURL}/users/${id}`, editingUser);

      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...editingUser } : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${APIURL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSelectedUsers = async () => {
    if (selectedUserIds.length === 0) return;

    setDeleteLoading(true);
    try {
      await axios.post(`${APIURL}/users/delete`, { ids: selectedUserIds });
      setUsers(users.filter((user) => !selectedUserIds.includes(user.id)));
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error deleting selected users:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">User Dashboard</h1>
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Add New User</h2>
        <div className="mb-4">
          <input
            type="text"
            className="p-2 border rounded mb-2 w-full text-gray-900"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            className="p-2 border rounded mb-2 w-full text-gray-900"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white p-2 rounded w-full"
            onClick={handleAddUser}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Users List</h2>
        <button
          className="bg-red-600 text-white p-2 rounded mb-4"
          onClick={handleDeleteSelectedUsers}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting Selected..." : "Delete Users"}
        </button>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                  <span className="text-gray-700">
                    {user.name} - {user.email}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No users available.</p>
        )}

        {editingUser && (
          <div className="mt-6 bg-gray-200 p-4 rounded">
            <h3 className="text-lg font-medium mb-2">Edit User</h3>
            <input
              type="text"
              className="p-2 border rounded mb-2 w-full text-gray-900"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />
            <input
              type="email"
              className="p-2 border rounded mb-2 w-full text-gray-900"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white p-2 rounded"
              onClick={() => handleUpdateUser(editingUser.id)}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
