// Individual Task Card Component
import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, isPending = false, isBeingDeleted = false }) => {
  
  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#22c55e',
      'Medium': '#f59e0b', 
      'High': '#ef4444',
      'Critical': '#dc2626'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Todo': '#6b7280',
      'In Progress': '#3b82f6',
      'Review': '#f59e0b',
      'Done': '#22c55e'
    };
    return colors[status] || '#6b7280';
  };

  const getTaskTypeIcon = (taskType) => {
    return taskType || '';
  };

  if (isBeingDeleted) {
    return (
      <div className="task-card being-deleted">
        <div className="deleting-indicator">
          <div className="spinner"></div>
          <span>Deleting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.taskType?.toLowerCase()} ${isPending ? 'pending' : ''}`}>
      {/* Optimistic update indicator */}
      {isPending && (
        <div className="pending-indicator">
          <div className="spinner"></div>
          <span>Syncing...</span>
        </div>
      )}

      <div className="task-card-header">
        <div className="task-meta">
          <span 
            className="task-type"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {getTaskTypeIcon(task.taskType)}
          </span>
          <span 
            className="task-status"
            style={{ color: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
        </div>
        
        <div className="task-actions">
          <button onClick={onEdit} className="btn-edit" disabled={isPending}>
            ✏️
          </button>
          <button onClick={onDelete} className="btn-delete" disabled={isPending}>
            🗑️
          </button>
        </div>
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        
        {task.description && (
          <p className="task-description">
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...`
              : task.description
            }
          </p>
        )}

        {/* Task-type specific information */}
        {task.taskType === 'Bug' && task.severity && (
          <div className="task-severity">
            <span className="label">Severity:</span>
            <span className={`severity-${task.severity?.toLowerCase()}`}>
              {task.severity}
            </span>
          </div>
        )}

        {task.taskType === 'Feature' && task.acceptanceCriteria?.length > 0 && (
          <div className="task-criteria">
            <span className="label">Acceptance Criteria:</span>
            <span>{task.acceptanceCriteria.length} items</span>
          </div>
        )}

        {task.taskType === 'Enhancement' && (task.currentBehavior || task.proposedBehavior) && (
          <div className="task-enhancement">
            <span className="label">Enhancement Task</span>
          </div>
        )}

        {task.taskType === 'Research' && task.researchQuestions?.length > 0 && (
          <div className="task-research">
            <span className="label">Research Questions:</span>
            <span>{task.researchQuestions.length} items</span>
          </div>
        )}

        {/* Subtasks count */}
        {task.subtasks?.length > 0 && (
          <div className="task-subtasks">
            <span className="label">Subtasks:</span>
            <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
          </div>
        )}
      </div>

      <div className="task-footer">
        <div className="task-assignee">
          {task.assigneeId ? `Assigned to: User ${task.assigneeId}` : 'Unassigned'}
        </div>
        
        {task.dueDate && (
          <div className={`task-due-date ${new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        <div className="task-priority">
          <span className="label">Priority:</span>
          <span style={{ color: getPriorityColor(task.priority) }}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;