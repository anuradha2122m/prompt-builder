import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPromptById } from '@/lib/prompts';
import SearchBar from '@/components/SearchBar';
import PromptPageClient from '@/components/PromptPageClient';

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Disable static generation temporarily due to data size
// export async function generateStaticParams() {
//   const prompts = getAllPrompts();
//   return prompts.map((prompt) => ({
//     id: prompt.id,
//   }));
// }

export async function generateMetadata({ params }: PromptPageProps) {
  const { id } = await params;
  const prompt = getPromptById(id);
  
  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${prompt.title} - AI Prompt Library`,
    description: prompt.description,
  };
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const prompt = getPromptById(decodeURIComponent(id));
  
  if (!prompt) {
    notFound();
  }

  const getModelBadgeColor = () => {
    return 'bg-gray-700 text-gray-300 border border-gray-600';
  };

  const formatModelName = (model: string) => {
    return model.replace('openai/', '').replace('anthropic/', '').replace('google/', '');
  };


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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-200 font-mono">
                  Home
                </Link>
              </li>
              {prompt.categories[0] && (
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
                    <Link
                      href={`/category/${encodeURIComponent(prompt.categories[0])}`}
                      className="ml-4 text-gray-400 hover:text-gray-200 font-mono"
                    >
                      {prompt.categories[0]}
                    </Link>
                  </div>
                </li>
              )}
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
                  <span className="ml-4 text-gray-200 font-medium truncate font-mono">
                    {prompt.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-100 flex-1 font-mono">
                {prompt.title}
              </h1>
              {prompt.is_featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 ml-4 border border-gray-600 font-mono">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-200 mb-2 font-mono">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${encodeURIComponent(category)}`}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600 font-mono"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-200 mb-2 font-mono">Compatible Models</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.model_parameters.models && prompt.model_parameters.models.length > 0 ? (
                    prompt.model_parameters.models.map((model) => (
                      <span
                        key={model}
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${getModelBadgeColor()} font-mono`}
                      >
                        {formatModelName(model)}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600 font-mono">
                      All models
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Display Card */}
          <div className="p-6">
            <PromptPageClient 
              promptText={prompt.prompt_text}
              description={prompt.description}
            />

            {/* Additional Instructions */}
            {prompt.model_parameters.additional_instructions && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3 font-mono">Usage Instructions</h3>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-300 text-sm font-mono">
                    {prompt.model_parameters.additional_instructions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-mono transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-mono">
            © 2025 Prompt Vault Library by Unlearn Product. All prompts are curated and freely available.
          </p>
        </div>
      </footer>
    </div>
  );
}