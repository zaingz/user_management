import { User, NewUser } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const fetchUsers = async (page: number): Promise<{ users: User[], total: number, limit: number }> => {
  const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=10`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.body;
};

export const createUser = async (newUser: NewUser): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create user: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
  }
  return response.json();
};

export const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};