'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BoardCard from '@/components/BoardCard';
import { Board, User } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<(Board & { totalTasks: number; completedTasks: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchBoards();
  }, []);

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

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards');
      if (response.ok) {
        const data = await response.json();
        setBoards(data.data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBoard),
      });

      if (response.ok) {
        setNewBoard({ name: '', description: '' });
        setIsCreatingBoard(false);
        fetchBoards();
      }
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Task Boards</h1>
            <p className="text-gray-600 mt-2">Organize your tasks with custom boards</p>
          </div>
          
          <button
            onClick={() => setIsCreatingBoard(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 shadow-md cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>New Board</span>
          </button>
        </div>

        {/* Create Board Form */}
        {isCreatingBoard && (
          <div className="bg-white rounded-lg shadow-md border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 ">Create New Board</h2>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Work Tasks, Personal Goals"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newBoard.description}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this board"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Board'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingBoard(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No boards yet</div>
            <p className="text-gray-500 mb-6">Create your first board to start organizing your tasks</p>
            <button
              onClick={() => setIsCreatingBoard(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onUpdate={fetchBoards}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}