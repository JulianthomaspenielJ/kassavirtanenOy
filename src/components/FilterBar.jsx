// Filter Bar Component
import React, { useState, useEffect } from 'react';
import { TASK_TYPES, PRIORITIES, STATUSES } from '../api/mockApi';

const FilterBar = ({ 
  filters = {}, 
  projects = [], 
  users = [], 
  onFiltersChange 
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchInput
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, onFiltersChange, filters]);

  const handleFilterChange = (filterKey, value) => {
    onFiltersChange({
      ...filters,
      [filterKey]: value
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFiltersChange({
      projectId: null,
      assigneeId: null,
      status: 'all',
      taskType: 'all',
      search: ''
    });
  };

  // Count active filters
  const activeFilterCount = [
    filters.projectId,
    filters.assigneeId,
    filters.status !== 'all' ? filters.status : null,
    filters.taskType !== 'all' ? filters.taskType : null,
    filters.search
  ].filter(Boolean).length;

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Search Input */}
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Project Filter */}
        <div className="filter-group">
          <select
            value={filters.projectId || ''}
            onChange={(e) => handleFilterChange('projectId', e.target.value || null)}
            className="filter-select"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="filter-group">
          <select
            value={filters.assigneeId || ''}
            onChange={(e) => handleFilterChange('assigneeId', e.target.value || null)}
            className="filter-select"
          >
            <option value="">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Task Type Filter */}
        <div className="filter-group">
          <select
            value={filters.taskType || 'all'}
            onChange={(e) => handleFilterChange('taskType', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {TASK_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="filter-group">
          <button 
            onClick={clearAllFilters}
            className="clear-filters-btn"
            disabled={activeFilterCount === 0}
          >
            Clear Filters ({activeFilterCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;