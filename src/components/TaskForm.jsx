// Dynamic Task Form Component
import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from '../api/mockApi';

const TaskForm = ({ 
  isOpen, 
  mode, // 'create' or 'edit'
  initialData = null,
  onSubmit,
  onClose,
  users = [],
  projects = [],
  loading = false 
}) => {
  
  const { control, handleSubmit, watch, reset, formState: { errors, isValid }, setValue, getValues } = useForm({
    defaultValues: {
      title: '',
      description: '',
      taskType: 'Bug',
      priority: 'Medium',
      projectId: '',
      assigneeId: '',
      dueDate: '',
      severity: 'Medium',
      stepsToReproduce: '',
      businessValue: '',
      acceptanceCriteria: [{ value: '' }],
      currentBehavior: '',
      proposedBehavior: '',
      researchQuestions: [{ value: '' }],
      expectedOutcomes: '',
      subtasks: [{ title: '', completed: false }],
      attachments: []
    },
    mode: 'onChange'
  });

  const { fields: acceptanceCriteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({
    control,
    name: 'acceptanceCriteria'
  });

  const { fields: researchQuestionsFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'researchQuestions'
  });

  const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
    control,
    name: 'subtasks'
  });

  const watchedTaskType = watch('taskType');
  const watchedProjectId = watch('projectId');

  // Filter users based on selected project
  const availableUsers = useMemo(() => {
    if (!watchedProjectId) return users;
    const project = projects.find(p => p.id === watchedProjectId);
    if (!project) return users;
    return users.filter(user => project.userIds.includes(user.id));
  }, [users, projects, watchedProjectId]);

  // Auto-save functionality
  useEffect(() => {
    if (!isOpen) return;

    const autoSaveInterval = setInterval(() => {
      const formData = getValues();
      localStorage.setItem('taskFormData', JSON.stringify(formData));
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [isOpen, getValues]);

  // Restore form data from localStorage on mount
  useEffect(() => {
    if (isOpen && mode === 'create') {
      const savedData = localStorage.getItem('taskFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          reset(parsedData);
        } catch (error) {
          console.error('Failed to parse saved form data:', error);
        }
      }
    }
  }, [isOpen, mode, reset]);

  // Reset form when opening with initial data
  useEffect(() => {
    if (isOpen && initialData && mode === 'edit') {
      reset(initialData);
    } else if (isOpen && mode === 'create') {
      reset({
        title: '',
        description: '',
        taskType: 'Bug',
        priority: 'Medium',
        projectId: '',
        assigneeId: '',
        dueDate: '',
        severity: 'Medium',
        stepsToReproduce: '',
        businessValue: '',
        acceptanceCriteria: [{ value: '' }],
        currentBehavior: '',
        proposedBehavior: '',
        researchQuestions: [{ value: '' }],
        expectedOutcomes: '',
        subtasks: [{ title: '', completed: false }],
        attachments: []
      });
    }
  }, [isOpen, initialData, mode, reset]);

  // Clear localStorage on successful submit
  const handleFormSubmit = (data) => {
    localStorage.removeItem('taskFormData');
    onSubmit(data);
  };

  // Render dynamic fields based on task type
  const renderDynamicFields = () => {
    switch (watchedTaskType) {
      case 'Bug':
        return (
          <>
            <div className="form-group">
              <label>Severity *</label>
              <Controller
                name="severity"
                control={control}
                rules={{ required: 'Severity is required' }}
                render={({ field }) => (
                  <select {...field} className={errors.severity ? 'error' : ''}>
                    {BUG_SEVERITIES.map(severity => (
                      <option key={severity} value={severity}>{severity}</option>
                    ))}
                  </select>
                )}
              />
              {errors.severity && <span className="error-message">{errors.severity.message}</span>}
            </div>

            <div className="form-group">
              <label>Steps to Reproduce *</label>
              <Controller
                name="stepsToReproduce"
                control={control}
                rules={{ required: 'Steps to reproduce are required' }}
                render={({ field }) => (
                  <textarea 
                    {...field} 
                    rows={4}
                    placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                    className={errors.stepsToReproduce ? 'error' : ''}
                  />
                )}
              />
              {errors.stepsToReproduce && <span className="error-message">{errors.stepsToReproduce.message}</span>}
            </div>
          </>
        );

      case 'Feature':
        return (
          <>
            <div className="form-group">
              <label>Business Value *</label>
              <Controller
                name="businessValue"
                control={control}
                rules={{ required: 'Business value is required' }}
                render={({ field }) => (
                  <textarea 
                    {...field} 
                    rows={3}
                    placeholder="Describe the business value of this feature..."
                    className={errors.businessValue ? 'error' : ''}
                  />
                )}
              />
              {errors.businessValue && <span className="error-message">{errors.businessValue.message}</span>}
            </div>

            <div className="form-group">
              <label>Acceptance Criteria</label>
              {acceptanceCriteriaFields.map((field, index) => (
                <div key={field.id} className="field-array-item">
                  <Controller
                    name={`acceptanceCriteria.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <input 
                        {...field} 
                        placeholder={`Criterion ${index + 1}`}
                        className="field-array-input"
                      />
                    )}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeCriteria(index)}
                    className="remove-field-btn"
                    disabled={acceptanceCriteriaFields.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => appendCriteria({ value: '' })}
                className="add-field-btn"
              >
                + Add Criterion
              </button>
            </div>
          </>
        );

      case 'Enhancement':
        return (
          <>
            <div className="form-group">
              <label>Current Behavior *</label>
              <Controller
                name="currentBehavior"
                control={control}
                rules={{ required: 'Current behavior is required' }}
                render={({ field }) => (
                  <textarea 
                    {...field} 
                    rows={3}
                    placeholder="Describe the current behavior..."
                    className={errors.currentBehavior ? 'error' : ''}
                  />
                )}
              />
              {errors.currentBehavior && <span className="error-message">{errors.currentBehavior.message}</span>}
            </div>

            <div className="form-group">
              <label>Proposed Behavior *</label>
              <Controller
                name="proposedBehavior"
                control={control}
                rules={{ required: 'Proposed behavior is required' }}
                render={({ field }) => (
                  <textarea 
                    {...field} 
                    rows={3}
                    placeholder="Describe the proposed behavior..."
                    className={errors.proposedBehavior ? 'error' : ''}
                  />
                )}
              />
              {errors.proposedBehavior && <span className="error-message">{errors.proposedBehavior.message}</span>}
            </div>
          </>
        );

      case 'Research':
        return (
          <>
            <div className="form-group">
              <label>Research Questions</label>
              {researchQuestionsFields.map((field, index) => (
                <div key={field.id} className="field-array-item">
                  <Controller
                    name={`researchQuestions.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <input 
                        {...field} 
                        placeholder={`Research question ${index + 1}`}
                        className="field-array-input"
                      />
                    )}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(index)}
                    className="remove-field-btn"
                    disabled={researchQuestionsFields.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => appendQuestion({ value: '' })}
                className="add-field-btn"
              >
                + Add Question
              </button>
            </div>

            <div className="form-group">
              <label>Expected Outcomes *</label>
              <Controller
                name="expectedOutcomes"
                control={control}
                rules={{ required: 'Expected outcomes are required' }}
                render={({ field }) => (
                  <textarea 
                    {...field} 
                    rows={3}
                    placeholder="Describe the expected outcomes..."
                    className={errors.expectedOutcomes ? 'error' : ''}
                  />
                )}
              />
              {errors.expectedOutcomes && <span className="error-message">{errors.expectedOutcomes.message}</span>}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Basic Fields */}
          <div className="form-group">
            <label>Title *</label>
            <Controller
              name="title"
              control={control}
              rules={{ 
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              }}
              render={({ field }) => (
                <input 
                  {...field} 
                  type="text"
                  placeholder="Enter task title..."
                  className={errors.title ? 'error' : ''}
                />
              )}
            />
            {errors.title && <span className="error-message">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Task Type *</label>
            <Controller
              name="taskType"
              control={control}
              rules={{ required: 'Task type is required' }}
              render={({ field }) => (
                <select {...field} className={errors.taskType ? 'error' : ''}>
                  {TASK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
            />
            {errors.taskType && <span className="error-message">{errors.taskType.message}</span>}
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: 'Priority is required' }}
              render={({ field }) => (
                <select {...field} className={errors.priority ? 'error' : ''}>
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              )}
            />
            {errors.priority && <span className="error-message">{errors.priority.message}</span>}
          </div>

          <div className="form-group">
            <label>Project</label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="form-group">
            <label>Assignee</label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <select {...field} disabled={!watchedProjectId}>
                  <option value="">Unassigned</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Controller
              name="description"
              control={control}
              rules={{ 
                maxLength: { value: 500, message: 'Description must be less than 500 characters' }
              }}
              render={({ field }) => (
                <textarea 
                  {...field} 
                  rows={3}
                  placeholder="Enter task description..."
                  className={errors.description ? 'error' : ''}
                />
              )}
            />
            {errors.description && <span className="error-message">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <input {...field} type="date" />
              )}
            />
          </div>

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Subtasks */}
          <div className="form-group">
            <label>Subtasks</label>
            {subtaskFields.map((field, index) => (
              <div key={field.id} className="field-array-item">
                <Controller
                  name={`subtasks.${index}.title`}
                  control={control}
                  render={({ field }) => (
                    <input 
                      {...field} 
                      placeholder={`Subtask ${index + 1}`}
                      className="field-array-input"
                    />
                  )}
                />
                <button 
                  type="button" 
                  onClick={() => removeSubtask(index)}
                  className="remove-field-btn"
                  disabled={subtaskFields.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => appendSubtask({ title: '', completed: false })}
              className="add-field-btn"
            >
              + Add Subtask
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading || !isValid} className="submit-btn">
              {loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;