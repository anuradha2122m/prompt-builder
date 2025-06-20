'use client';

import { useState } from 'react';

interface PromptDisplayCardProps {
  fullPromptText: string;
  variables?: Record<string, string>;
}

export default function PromptDisplayCard({ fullPromptText, variables = {} }: PromptDisplayCardProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract variables from prompt text (e.g., {{task}}, {{Your product}}, etc.)
  const extractVariables = (text: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(variableRegex)];
    return [...new Set(matches.map(match => match[1].trim()))]; // Remove duplicates and trim
  };
  
  // Highlight variables in prompt text with styling
  const highlightVariables = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (part.match(/\{\{[^}]+\}\}/)) {
        const varName = part.replace(/[{}]/g, '').trim();
        const userValue = variables[varName];
        
        if (userValue) {
          // Show user input with different styling
          return (
            <span key={index} className="bg-gray-500 text-white px-2 py-1 rounded border border-gray-400">
              {userValue}
            </span>
          );
        } else {
          // Highlight the placeholder with gray gradient colors
          return (
            <span key={index} className="bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900 px-2 py-1 rounded border border-gray-300 font-bold">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };
  
  const variableNames = extractVariables(fullPromptText);
  const hasVariables = variableNames.length > 0;

  const handleCopy = async () => {
    try {
      // Replace variables in prompt text with user input values for copying
      let textToCopy = fullPromptText;
      if (hasVariables) {
        textToCopy = fullPromptText.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
          const trimmedVarName = varName.trim();
          return variables[trimmedVarName] || match;
        });
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-200 font-mono">Prompt</h2>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-mono"
          >
            {copied ? (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="bg-gray-700 rounded-xl border border-gray-600 shadow-sm overflow-hidden">
        <div className="relative">
          {/* Gray accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-400 to-gray-500"></div>
          
          {/* Content area */}
          <div className="p-8 pl-10">
            <div className="prose prose-lg max-w-none">
              <div className="text-base leading-8 text-gray-200 whitespace-pre-wrap font-mono tracking-wide">
                {hasVariables ? highlightVariables(fullPromptText) : fullPromptText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}