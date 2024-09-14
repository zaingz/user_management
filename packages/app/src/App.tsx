import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:3001/api/v1'; // Update this to match the new port

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      console.log(`Fetching users for page ${page}`);
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setUsers(data.body.users);
      setTotalPages(Math.ceil(data.body.total / data.body.limit));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserClick = (userId: number) => {
    console.log(`User clicked: ${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      await fetchUsers(currentPage);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('handleCreateUser called');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Creating user:', newUser);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create user: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
      }
      const createdUser = await response.json();
      console.log('User created:', createdUser);
      setNewUser({ name: '', email: '' });
      await fetchUsers(currentPage);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <form onSubmit={handleCreateUser} className="mb-4">
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create User
        </button>
      </form>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}

      <UserTable
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onUserClick={handleUserClick}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default App;