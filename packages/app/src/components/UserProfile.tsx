import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '@searchland/shared';
import { fetchUser } from '../api/userApi';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUser(parseInt(userId, 10));
        setUser(userData);
      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Warning:</strong>
        <span className="block sm:inline"> User not found</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-center sm:justify-start">
            <img
              className="h-32 w-32 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
              alt={user.name}
            />
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <p className="text-gray-900 text-lg">{user.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <p className="text-gray-900 text-lg">{user.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Created At:</label>
              <p className="text-gray-900 text-lg">{new Date(user.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;