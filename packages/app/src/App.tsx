import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import UserProfile from './components/UserProfile';

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
  const [currentRoute, setCurrentRoute] = useState('/');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
    setSelectedUserId(userId);
    setCurrentRoute(`/user/${userId}`);
  };

  const handleBackToList = () => {
    setCurrentRoute('/');
    setSelectedUserId(null);
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">User Management</h1>
        
        {currentRoute === '/' ? (
          <>
            <div className="create-user-form">
              <div className="px-8 py-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New User</h2>
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      className="create-user-form input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="create-user-form input"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="create-user-form button"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {errorMessage && (
              <div className="error-message" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Error:</span> {errorMessage}
                    </p>
                  </div>
                </div>
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
          </>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
            <UserProfile userId={selectedUserId} onBackClick={handleBackToList} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;