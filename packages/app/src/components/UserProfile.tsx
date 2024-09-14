import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:3001/api/v1';

interface UserProfileProps {
  userId: number | null;
  onBackClick: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onBackClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data.body);
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <button onClick={onBackClick} className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to User List</button>
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Created At:</label>
          <p className="text-gray-900">{new Date(user.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;