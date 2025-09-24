'use client';

import { useState } from 'react';

export interface PostFilters {
  searchTerm: string;
  selectedTags: string[];
  dateFrom: string;
  dateTo: string;
  visibility: 'all' | 'active' | 'inactive';
}

export interface PostSorting {
  field: 'title' | 'createdAt';
  direction: 'asc' | 'desc';
}

interface PostFilterProps {
  filters: PostFilters;
  sorting: PostSorting;
  availableTags: string[];
  onFiltersChange: (filters: PostFilters) => void;
  onSortingChange: (sorting: PostSorting) => void;
}

export default function PostFilter({
  filters,
  sorting,
  availableTags,
  onFiltersChange,
  onSortingChange,
}: PostFilterProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleTagToggle = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({ ...filters, dateFrom });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({ ...filters, dateTo });
  };

  const handleVisibilityChange = (visibility: 'all' | 'active' | 'inactive') => {
    onFiltersChange({ ...filters, visibility });
  };

  const handleSortFieldChange = (field: 'title' | 'createdAt') => {
    onSortingChange({ ...sorting, field });
  };

  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    onSortingChange({ ...sorting, direction });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters & Sorting</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Title or Content
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search posts..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
          />
        </div>
      </div>

      {/* Visibility Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="all"
              checked={filters.visibility === 'all'}
              onChange={(e) => handleVisibilityChange(e.target.value as 'all')}
              className="mr-2"
            />
            All Posts
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="active"
              checked={filters.visibility === 'active'}
              onChange={(e) => handleVisibilityChange(e.target.value as 'active')}
              className="mr-2"
            />
            Active Only
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="visibility"
              value="inactive"
              checked={filters.visibility === 'inactive'}
              onChange={(e) => handleVisibilityChange(e.target.value as 'inactive')}
              className="mr-2"
            />
            Inactive Only
          </label>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className="mr-2"
              />
              <span className={`px-2 py-1 text-xs rounded ${
                filters.selectedTags.includes(tag)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sorting.field}
            onChange={(e) => handleSortFieldChange(e.target.value as 'title' | 'createdAt')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="title">Title</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Direction
          </label>
          <select
            value={sorting.direction}
            onChange={(e) => handleSortDirectionChange(e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}