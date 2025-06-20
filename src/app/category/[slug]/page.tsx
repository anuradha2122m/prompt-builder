import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getPromptsByCategory, convertToCardData } from '@/lib/prompts';
import PromptCardWithStats from '@/components/PromptCardWithStats';
import SearchBar from '@/components/SearchBar';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disable static generation temporarily due to long category names
// export async function generateStaticParams() {
//   const categories = getAllCategories();
//   return categories.map((category) => ({
//     slug: encodeURIComponent(category),
//   }));
// }

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const categories = getAllCategories();
  
  if (!categories.includes(category)) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category} Prompts - Prompt Vault Library`,
    description: `Discover curated AI prompts for ${category}. Find expert-crafted prompts for ChatGPT, GPT-4, and other AI models.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const categories = getAllCategories();
  
  if (!categories.includes(category)) {
    notFound();
  }

  const prompts = getPromptsByCategory(category);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-100 font-mono">
              Prompt Vault Library
            </Link>
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-200 font-mono">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-gray-200 font-medium font-mono">{category}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-100 mb-4 font-mono">
              {category} Prompts
            </h1>
            <p className="text-xl text-gray-400 mb-6 font-mono">
              {prompts.length} curated prompts for {category.toLowerCase()}
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar placeholder={`Search ${category.toLowerCase()} prompts...`} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300 font-mono">Sort by:</span>
              <select className="border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-gray-100 font-mono">
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
            <div className="text-sm text-gray-400 font-mono">
              Showing {prompts.length} prompts
            </div>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        {prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCardWithStats key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2 font-mono">
              No prompts found in this category
            </h3>
            <p className="text-gray-400 mb-6 font-mono">
              This category doesn&apos;t have any prompts yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 font-mono"
            >
              Browse All Categories
            </Link>
          </div>
        )}
      </main>


      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-mono">
            © 2025 Prompt Vault Library by Unlearn Product. All prompts are curated and freely available.
          </p>
        </div>
      </footer>
    </div>
  );
}