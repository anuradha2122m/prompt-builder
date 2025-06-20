'use client';

import { useState } from 'react';

interface PromptDescriptionCardProps {
  description: string;
}

export default function PromptDescriptionCard({ description }: PromptDescriptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine if text is long enough to need collapsing (more than 200 characters)
  const isLongText = description.length > 200;
  const shouldShowToggle = isLongText;
  
  // Show truncated text when collapsed and long text
  const displayText = isLongText && !isExpanded 
    ? description.substring(0, 200) + '...' 
    : description;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-200 font-mono">Context</h2>
          {shouldShowToggle && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center text-sm text-gray-300 hover:text-gray-100 font-medium transition-colors font-mono"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show more</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1 font-mono">Learn about this prompt and how to use it effectively</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="relative">
          {/* Gray accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full"></div>
          
          {/* Description content */}
          <div className="pl-6">
            <div className="text-base leading-7 text-gray-300 font-mono">
              {displayText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}