export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  userId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}