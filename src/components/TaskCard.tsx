// 'use client';

// import { useState } from 'react';
// import { Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
// import { Task } from '@/types';
// import { formatDate, getDaysUntilDue } from '@/lib/utils';

// interface TaskCardProps {
//   task: Task;
//   onUpdate: () => void;
// }

// export default function TaskCard({ task, onUpdate }: TaskCardProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({
//     title: task.title,
//     description: task.description || '',
//     dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleStatusToggle = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/tasks/${task._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           status: task.status === 'completed' ? 'pending' : 'completed',
//         }),
//       });

//       if (response.ok) {
//         onUpdate();
//       }
//     } catch (error) {
//       console.error('Error updating task status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/tasks/${task._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...editForm,
//           dueDate: editForm.dueDate ? new Date(editForm.dueDate) : null,
//         }),
//       });

//       if (response.ok) {
//         setIsEditing(false);
//         onUpdate();
//       }
//     } catch (error) {
//       console.error('Error updating task:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this task?')) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`/api/tasks/${task._id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         onUpdate();
//       }
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isEditing) {
//     return (
//       <div className="bg-white rounded-lg shadow-md border p-4">
//         <form onSubmit={handleEdit} className="space-y-4">
//           <input
//             type="text"
//             value={editForm.title}
//             onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
//             className="w-full font-semibold text-lg border-b-2 border-blue-500 bg-transparent focus:outline-none"
//             required
//           />
//           <textarea
//             value={editForm.description}
//             onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
//             className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Task description (optional)"
//             rows={3}
//           />
//           <input
//             type="date"
//             value={editForm.dueDate}
//             onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
//   const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

//   return (
//     <div className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 ${
//       task.status === 'completed' ? 'opacity-75' : ''
//     }`}>
//       <div className="p-4">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-start space-x-3 flex-1">
//             <input
//               type="checkbox"
//               checked={task.status === 'completed'}
//               onChange={handleStatusToggle}
//               disabled={loading}
//               className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <div className="flex-1">
//               <h3 className={`font-semibold text-gray-800 ${
//                 task.status === 'completed' ? 'line-through text-gray-500' : ''
//               }`}>
//                 {task.title}
//               </h3>
//               {task.description && (
//                 <p className="text-gray-600 text-sm mt-1">{task.description}</p>
//               )}
//             </div>
//           </div>
          
//           <div className="relative">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-1 text-gray-400 hover:text-gray-600 rounded"
//             >
//               <MoreVertical className="h-4 w-4" />
//             </button>
            
//             {isMenuOpen && (
//               <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
//                 <button
//                   onClick={() => {
//                     setIsEditing(true);
//                     setIsMenuOpen(false);
//                   }}
//                   className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
//                 >
//                   <Edit className="h-3 w-3" />
//                   <span className="text-sm">Edit</span>
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
//                 >
//                   <Trash2 className="h-3 w-3" />
//                   <span className="text-sm">Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Due Date */}
//         {task.dueDate && (
//           <div className={`flex items-center space-x-1 text-xs ${
//             isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-500'
//           }`}>
//             {isOverdue || isDueToday ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
//             <span>{getDaysUntilDue(task.dueDate)}</span>
//           </div>
//         )}

//         {/* Status Badge */}
//         <div className="flex justify-between items-center mt-3">
//           <span className="text-xs text-gray-500">
//             Created {formatDate(task.createdAt)}
//           </span>
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               task.status === 'completed'
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-yellow-100 text-yellow-800'
//             }`}
//           >
//             {task.status === 'completed' ? 'Completed' : 'Pending'}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// } 


'use client';

import { useState } from 'react';
import { Calendar, Clock, MoreVertical, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, getDaysUntilDue } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: task.status === 'completed' ? 'pending' : 'completed',
        }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          dueDate: editForm.dueDate ? new Date(editForm.dueDate) : null,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border p-4">
        <form onSubmit={handleEdit} className="space-y-4">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full font-semibold text-lg border-b-2 border-blue-500 bg-transparent focus:outline-none"
            required
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description (optional)"
            rows={3}
          />
          <input
            type="date"
            value={editForm.dueDate}
            onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <div className={`bg-white rounded-lg shadow-md border-[2px] hover:shadow-lg transition-shadow duration-200 ${
      task.status === 'completed' ? 'opacity-75 border-green-300' : 'border-yellow-300'
    }`}>
      <div className="p-4">
        {/* Header with Status and Menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {task.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-yellow-500" />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {task.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 font-bold hover:text-gray-600 rounded"
            >
              <MoreVertical className="h-4 w-4 " />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Content */}
        <div className="mb-4">
          <h3 className={`font-semibold text-gray-800 mb-1 ${
            task.status === 'completed' ? ' text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm">{task.description}</p>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs mb-4 ${
            isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-500'
          }`}>
            {isOverdue || isDueToday ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
            <span>{getDaysUntilDue(task.dueDate)}</span>
          </div>
        )}

        {/* Footer with Created Date and Status Button */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created {formatDate(task.createdAt)}
          </span>
          <button
            onClick={handleStatusToggle}
            disabled={loading}
            className={`px-3 py-3 rounded-lg cursor-pointer text-xs  transition-colors disabled:opacity-50 font-bold ${
              task.status === 'completed'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {loading ? 'Updating...' : task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}