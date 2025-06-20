import Link from 'next/link';
import { Prompt } from '@/types/prompt';

interface PromptCardWithStatsProps {
  prompt: Prompt;
}

export default function PromptCardWithStats({ prompt }: PromptCardWithStatsProps) {
  const getModelBadgeColor = (model: string) => {
    if (model.includes('gpt-4') || model.includes('o3')) return 'bg-gray-700 text-gray-300 border-gray-600';
    if (model.includes('gpt-3') || model.includes('chatgpt')) return 'bg-gray-700 text-gray-300 border-gray-600';
    if (model.includes('claude')) return 'bg-gray-700 text-gray-300 border-gray-600';
    if (model.includes('gemini')) return 'bg-gray-700 text-gray-300 border-gray-600';
    return 'bg-gray-700 text-gray-300 border-gray-600';
  };

  const formatModelName = (model: string) => {
    return model.replace('openai/', '').replace('anthropic/', '').replace('google/', '');
  };

  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className="bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-700 hover:border-gray-600 cursor-pointer group relative">
        {/* Progress bar at top */}
        <div className="h-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded-t-lg"></div>
        
        <div className="p-6">
          {/* Header with title */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors line-clamp-2 font-mono">
              {prompt.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-mono">
            {prompt.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600 font-mono"
              >
                {category}
              </span>
            ))}
            {prompt.categories.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600 font-mono">
                +{prompt.categories.length - 2} more
              </span>
            )}
          </div>

          {/* Models */}
          {prompt.model_parameters.models && prompt.model_parameters.models.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompt.model_parameters.models.slice(0, 2).map((model) => (
                <span
                  key={model}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getModelBadgeColor(model)} border font-mono`}
                >
                  {formatModelName(model)}
                </span>
              ))}
              {prompt.model_parameters.models.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600 font-mono">
                  +{prompt.model_parameters.models.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Feedback button */}
        <div className="absolute bottom-4 right-4">
          <button className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}