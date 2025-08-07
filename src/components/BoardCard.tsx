'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit, Trash2, Calendar, CheckSquare } from 'lucide-react';
import { Board } from '@/types';
import { formatDate } from '@/lib/utils';

interface BoardCardProps {
  board: Board & {
    totalTasks: number;
    completedTasks: number;
  };
  onUpdate: () => void;
}

export default function BoardCard({ board, onUpdate }: BoardCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: board.name,
    description: board.description || '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/boards/${board._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this board? All tasks will be deleted.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/boards/${board._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = board.totalTasks > 0 
    ? Math.round((board.completedTasks / board.totalTasks) * 100) 
    : 0;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border p-6">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full text-xl font-semibold border-b-2 border-blue-500 bg-transparent focus:outline-none"
              required
            />
          </div>
          <div>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Board description (optional)"
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{board.name}</h3>
            {board.description && (
              <p className="text-gray-600 text-sm mb-3">{board.description}</p>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckSquare className="h-4 w-4" />
              <span>{board.completedTasks}/{board.totalTasks} tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(board.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push(`/dashboard/board/${board._id}`)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Open Board
        </button>
      </div>
    </div>
  );
}