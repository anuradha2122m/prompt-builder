import Link from 'next/link';
import { PromptCardData } from '@/types/prompt';

interface PromptCardProps {
  prompt: PromptCardData;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const getModelBadgeColor = (model: string) => {
    if (model.includes('gpt-4') || model.includes('o3')) return 'bg-green-100 text-green-800';
    if (model.includes('gpt-3') || model.includes('chatgpt')) return 'bg-blue-100 text-blue-800';
    if (model.includes('claude')) return 'bg-purple-100 text-purple-800';
    if (model.includes('gemini')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatModelName = (model: string) => {
    return model.replace('openai/', '').replace('anthropic/', '').replace('google/', '');
  };

  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full border border-gray-200 hover:border-blue-300 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {prompt.title}
          </h3>
          {prompt.is_featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {prompt.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
            >
              {category}
            </span>
          ))}
          {prompt.categories.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{prompt.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Models */}
        {prompt.models && prompt.models.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {prompt.models.slice(0, 2).map((model) => (
              <span
                key={model}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getModelBadgeColor(model)}`}
              >
                {formatModelName(model)}
              </span>
            ))}
            {prompt.models.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{prompt.models.length - 2} more
              </span>
            )}
          </div>
        )}

      </div>
    </Link>
  );
}