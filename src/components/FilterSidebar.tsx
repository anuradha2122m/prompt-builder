'use client';

import { useState } from 'react';
import { getAllCategories, getAllModels } from '@/lib/prompts';

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedModels: string[];
  onCategoryChange: (categories: string[]) => void;
  onModelChange: (models: string[]) => void;
  onSortChange: (sort: string) => void;
  sortBy: string;
}

export default function FilterSidebar({
  selectedCategories,
  selectedModels,
  onCategoryChange,
  onModelChange,
  onSortChange,
  sortBy
}: FilterSidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  
  const categories = getAllCategories();
  const models = getAllModels();
  
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);
  const displayedModels = showAllModels ? models : models.slice(0, 6);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleModelToggle = (model: string) => {
    if (selectedModels.includes(model)) {
      onModelChange(selectedModels.filter(m => m !== model));
    } else {
      onModelChange([...selectedModels, model]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    onModelChange([]);
  };

  const formatModelName = (model: string) => {
    return model.replace('openai/', '').replace('anthropic/', '').replace('google/', '');
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {(selectedCategories.length > 0 || selectedModels.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort by</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>

      {/* Filter by Category */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Filter by category</h3>
        </div>
        
        <div className="space-y-2">
          {displayedCategories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
          
          {categories.length > 8 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              {showAllCategories ? 'Show less' : `Show all ${categories.length} categories`}
            </button>
          )}
        </div>
      </div>

      {/* Filter by Model */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Model</h3>
        </div>
        
        <div className="space-y-2">
          {displayedModels.map((model) => (
            <label key={model} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => handleModelToggle(model)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{formatModelName(model)}</span>
            </label>
          ))}
          
          {models.length > 6 && (
            <button
              onClick={() => setShowAllModels(!showAllModels)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              {showAllModels ? 'Show less' : `Show all ${models.length} models`}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedModels.length > 0) && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Active Filters</h4>
          <div className="space-y-2">
            {selectedCategories.map((category) => (
              <div key={category} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                <span className="text-xs text-blue-800">{category}</span>
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {selectedModels.map((model) => (
              <div key={model} className="flex items-center justify-between bg-green-50 px-2 py-1 rounded">
                <span className="text-xs text-green-800">{formatModelName(model)}</span>
                <button
                  onClick={() => handleModelToggle(model)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}