'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TaskBoard from '@/components/TaskBoard';
import { Board, Task, User } from '@/types';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchBoard();
    fetchTasks();
  }, [boardId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      if (response.ok) {
        const data = await response.json();
        setBoard(data.data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching board:', error);
      router.push('/dashboard');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Board Not Found</h1>
          <p className="text-gray-600 mb-6">The board you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.name}</h1>
          {board.description && (
            <p className="text-gray-600 text-lg">{board.description}</p>
          )}
        </div>

        <TaskBoard
          boardId={boardId}
          tasks={tasks}
          onTaskUpdate={fetchTasks}
        />
      </div>
    </div>
  );
}