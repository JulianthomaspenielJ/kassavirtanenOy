// Task List Component
import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onEditTask, 
  onDeleteTask,
  pendingCreates = [],
  pendingDeletes = []
}) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || a.tempId || 0);
          bValue = new Date(b.createdAt || b.tempId || 0);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortedTasks = sortTasks(tasks);

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0 && pendingCreates.length === 0) {
    return (
      <div className="task-list-empty">
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks ({tasks.length})</h2>
        <div className="sort-options">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Sort by Created Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="task-grid">
        {sortedTasks.map(task => {
          const isPending = pendingCreates.some(pc => pc.tempId === task.tempId);
          const isBeingDeleted = pendingDeletes.includes(task.id);
          
          return (
            <TaskCard
              key={task.id || task.tempId}
              task={task}
              isPending={isPending}
              isBeingDeleted={isBeingDeleted}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;