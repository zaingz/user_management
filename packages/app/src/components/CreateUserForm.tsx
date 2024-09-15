import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Add React Query hooks
import { createUser } from '../api/userApi'; // Ensure correct import

interface CreateUserFormProps {
  API_BASE_URL: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ API_BASE_URL }) => {
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(createUser, {
    onSuccess: () => {
      setSuccessMessage('User created successfully!');
      setNewUser({ name: '', email: '' }); // Reset form
      queryClient.invalidateQueries(['users']); // Invalidate and refetch users
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    mutation.mutate(newUser); // Use mutation to create user
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000); // Hide messages after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="create-user-form">
      <div className="px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New User</h2>
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
  );
};

export default CreateUserForm;