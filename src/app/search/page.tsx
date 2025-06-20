import { Suspense } from 'react';
import Link from 'next/link';
import { searchPrompts, convertToCardData } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import SearchBar from '@/components/SearchBar';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function SearchResults({ query }: { query: string }) {
  const prompts = searchPrompts(query);
  const promptCards = prompts.map(convertToCardData);

  return (
    <>
      {/* Results Summary */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results for &quot;{query}&quot;
              </h2>
              <p className="text-sm text-gray-600">
                {prompts.length} prompts found
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="relevance">Relevance</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Try searching with different keywords or browse our categories.
            </p>
            <div className="space-y-4">
              <div className="max-w-md mx-auto">
                <SearchBar placeholder="Try a different search..." />
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              AI Prompt Library
            </Link>
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-gray-900 font-medium">Search</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {query ? (
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search AI Prompts
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find the perfect prompt for your AI project
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search prompts by title, description, or category..." />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 AI Prompt Library. All prompts are curated and freely available.
          </p>
        </div>
      </footer>
    </div>
  );
}