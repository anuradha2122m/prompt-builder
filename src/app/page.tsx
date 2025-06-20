'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllPrompts, getAllCategories, getAllModels } from '@/lib/prompts';
import PromptCardWithStats from '@/components/PromptCardWithStats';

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const allPrompts = getAllPrompts();
  const allCategories = getAllCategories();
  const models = getAllModels();

  // Define priority categories in specific order
  const priorityCategories = [
    'Product Management',
    'Design', 
    'Productivity', 
    'Marketing', 
    'Business',
    'Writing', 
    'Programming', 
    'MetaPrompting', 
    'Personal Growth', 
    'Cursor Rules',
    'RepoPrompt', 
    'Research'
  ];

  // Get remaining categories (exclude priority ones and filter out any that don't exist)
  const remainingCategories = allCategories.filter(cat => 
    !priorityCategories.includes(cat.trim())
  );

  // Combine priority + remaining categories
  const categories = [...priorityCategories.filter(cat => allCategories.includes(cat)), ...remainingCategories];

  const filteredPrompts = useMemo(() => {
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

    // If no filters applied, show curated mix from priority categories
    if (selectedCategories.length === 0 && selectedModel === 'all' && !searchQuery.trim()) {
      const mixedPrompts: any[] = [];
      const usedIds = new Set<string>();
      const coreCategories = ['Product Management', 'Design', 'Productivity', 'Marketing', 'Business'];
      
      // Get prompts from each core category (6 each), avoiding duplicates
      coreCategories.forEach(category => {
        const categoryPrompts = filtered
          .filter(prompt => prompt.categories.includes(category) && !usedIds.has(prompt.id))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6);
        
        categoryPrompts.forEach(prompt => {
          usedIds.add(prompt.id);
          mixedPrompts.push(prompt);
        });
      });
      
      // Fill remaining with other categories (up to 200 total)
      const remainingPrompts = filtered
        .filter(prompt => !usedIds.has(prompt.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, Math.max(0, 200 - mixedPrompts.length));
      
      mixedPrompts.push(...remainingPrompts);
      return mixedPrompts;
    }

    // Default sort by newest
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return filtered;
  }, [allPrompts, selectedCategories, selectedModel, searchQuery]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gray-600 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gray-500 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gray-400 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-mono tracking-tight">
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Prompt Vault
              </span>
              <br />
              <span className="text-gray-200">Library</span>
            </h1>
            
            {/* Subheading */}
            <p className={`text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto transition-all duration-1000 delay-200 transform font-mono ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              by{' '}
              <span className="font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                unlearn product
              </span>
            </p>

            {/* Description */}
            <p className={`text-lg text-gray-400 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-300 transform font-mono ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Discover, customize, and copy curated AI prompts for every use case. 
              Boost your productivity with our comprehensive collection of {isLoaded ? `${allPrompts.length}+` : '700+'} professional prompts.
            </p>

            {/* CTA Button */}
            <div className={`transition-all duration-1000 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-500 hover:border-gray-400 font-mono"
              >
                Explore Prompts
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-200 font-mono">{isLoaded ? `${allPrompts.length}+` : '700+'}</div>
                <div className="text-gray-400 font-mono">Curated Prompts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-200 font-mono">{isLoaded ? `${allCategories.length}+` : '175+'}</div>
                <div className="text-gray-400 font-mono">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-200 font-mono">{isLoaded ? `${models.length}+` : '15+'}</div>
                <div className="text-gray-400 font-mono">AI Models</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Header */}
      <div id="search-section" className="bg-gray-900 border-b border-gray-700 shadow-sm">
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
                  className="w-full px-4 py-3 pl-4 pr-4 text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-400 placeholder-gray-400 font-mono"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-6">
              {/* Model Filter */}
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-300 font-mono">Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-400 min-w-[140px] bg-gray-800 text-gray-100 font-mono"
                >
                  <option value="all">All models</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {formatModelName(model)}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-200 font-mono">Filter by category</h3>
              </div>
              
              {categories.length > 11 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="inline-flex items-center text-sm text-gray-300 hover:text-gray-100 font-medium transition-colors font-mono"
                >
                  {showAllCategories ? (
                    <>
                      <span>Show less</span>
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Show all {categories.length} categories</span>
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="text-sm text-gray-400 mt-2 font-mono">Filter by:</span>
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors font-mono ${
                    selectedCategories.length === 0
                      ? 'bg-gray-700 text-white border border-gray-600'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Prompts
                </button>
                
                {/* Show limited categories by default */}
                {(showAllCategories ? categories : categories.slice(0, 11)).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors font-mono ${
                      selectedCategories.includes(category)
                        ? 'bg-gray-700 text-white border border-gray-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {/* Show more indicator when collapsed */}
                {!showAllCategories && categories.length > 11 && (
                  <button
                    onClick={() => setShowAllCategories(true)}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors border-2 border-dashed border-gray-600 font-mono"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    +{categories.length - 11} more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 font-mono">
            {isLoaded ? `Showing ${filteredPrompts.length} of ${allPrompts.length} prompts` : 'Loading prompts...'}
          </p>
        </div>

        {/* Results Grid */}
        {isLoaded && filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCardWithStats key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : isLoaded ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2 font-mono">
              No prompts found
            </h3>
            <p className="text-gray-400 mb-6 font-mono">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedModel('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 font-mono"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 font-mono">Loading prompts...</div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-mono">
            © 2025 Prompt Vault Library by unlearn product. All prompts are curated and freely available.
          </p>
        </div>
      </footer>
    </div>
  );
}
