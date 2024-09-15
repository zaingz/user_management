import { User, CreateUserInput } from '@searchland/shared';
import { UseMutationResult, useQueryClient, useMutation } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const fetchUsers = async (page: number): Promise<{ users: User[], total: number, limit: number }> => {
  const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=10`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.body;
};

export const createUser = async (newUser: CreateUserInput): Promise<User> => {
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

export const useCreateUserMutation = (): UseMutationResult<User, Error, CreateUserInput> => {
  const queryClient = useQueryClient();
  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

export const fetchUser = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.body;
};