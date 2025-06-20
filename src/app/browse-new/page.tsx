'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllPrompts, getAllCategories, getAllModels } from '@/lib/prompts';
import PromptCardWithStats from '@/components/PromptCardWithStats';

export default function BrowseNewPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');

  const allPrompts = getAllPrompts();
  const categories = getAllCategories();
  const models = getAllModels();

  const filteredAndSortedPrompts = useMemo(() => {
    let filtered = allPrompts;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedCategories.some(category => prompt.categories.includes(category))
      );
    }

    // Filter by model
    if (selectedModel !== 'all') {
      filtered = filtered.filter(prompt =>
        prompt.model_parameters.models?.includes(selectedModel)
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
  }, [allPrompts, selectedCategories, selectedModel, sortBy, searchQuery]);

  const promptCards = filteredAndSortedPrompts;

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const formatModelName = (model: string) => {
    return model.replace('openai/', '').replace('anthropic/', '').replace('google/', '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              AI Prompt Library
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filter Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description, category or prompt text..."
                  className="w-full px-4 py-3 pl-4 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-6">
              {/* Model Filter */}
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
                >
                  <option value="all">All models</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {formatModelName(model)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-purple-600">●</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[140px] text-purple-600"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Filter by category</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.length === 0
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Prompts
                </button>
                
                {categories.slice(0, 12).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedPrompts.length} of {allPrompts.length} prompts
          </p>
        </div>

        {/* Results Grid */}
        {promptCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptCards.map((prompt) => (
              <PromptCardWithStats key={prompt.id} prompt={prompt} />
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
                setSelectedModel('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

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