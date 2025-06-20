'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllPrompts, convertToCardData } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';

export default function BrowsePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const allPrompts = getAllPrompts();

  const filteredAndSortedPrompts = useMemo(() => {
    let filtered = allPrompts;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedCategories.some(category => prompt.categories.includes(category))
      );
    }

    // Filter by models
    if (selectedModels.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedModels.some(model => prompt.model_parameters.models?.includes(model))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.categories.some(cat => cat.toLowerCase().includes(query)) ||
        prompt.prompt_text.toLowerCase().includes(query)
      );
    }

    // Sort prompts
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.copy_count - a.copy_count);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [allPrompts, selectedCategories, selectedModels, sortBy, searchQuery]);

  const promptCards = filteredAndSortedPrompts.map(convertToCardData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              AI Prompt Library
            </Link>
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar 
                placeholder="Search by title, description, category or prompt text..." 
                onSearch={handleSearch}
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedPrompts.length} prompts
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          selectedCategories={selectedCategories}
          selectedModels={selectedModels}
          onCategoryChange={setSelectedCategories}
          onModelChange={setSelectedModels}
          onSortChange={setSortBy}
          sortBy={sortBy}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filter Summary */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Browse AI Prompts
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <span>Showing {filteredAndSortedPrompts.length} of {allPrompts.length} prompts</span>
              {(selectedCategories.length > 0 || selectedModels.length > 0 || searchQuery) && (
                <span className="ml-2">
                  • Filtered by: {' '}
                  {selectedCategories.length > 0 && `${selectedCategories.length} categories`}
                  {selectedCategories.length > 0 && selectedModels.length > 0 && ', '}
                  {selectedModels.length > 0 && `${selectedModels.length} models`}
                  {searchQuery && ` • Search: "${searchQuery}"`}
                </span>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {promptCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {promptCards.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No prompts found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedModels([]);
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 AI Prompt Library. All prompts are curated and freely available.
          </p>
        </div>
      </footer>
    </div>
  );
}