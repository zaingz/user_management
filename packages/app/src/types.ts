export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface NewUser {
  name: string;
  email: string;
}