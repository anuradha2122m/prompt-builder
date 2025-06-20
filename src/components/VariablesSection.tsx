'use client';

import { useState } from 'react';

interface VariablesSectionProps {
  promptText: string;
  onVariablesChange: (variables: Record<string, string>) => void;
}

export default function VariablesSection({ promptText, onVariablesChange }: VariablesSectionProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Extract variables from prompt text (e.g., {{task}}, {{Your product}}, etc.)
  const extractVariables = (text: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...text.matchAll(variableRegex)];
    return [...new Set(matches.map(match => match[1].trim()))]; // Remove duplicates and trim
  };

  const variableNames = extractVariables(promptText);
  const hasVariables = variableNames.length > 0;

  const handleVariableChange = (varName: string, value: string) => {
    const newVariables = {
      ...variables,
      [varName]: value
    };
    setVariables(newVariables);
    onVariablesChange(newVariables);
  };

  // Don't render if no variables
  if (!hasVariables) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200 font-mono">Variables</h2>
        <p className="text-sm text-gray-400 mt-1 font-mono">Customize the prompt by filling in the variables below. The prompt will update in real-time.</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {variableNames.map((varName) => (
            <div key={varName}>
              <label htmlFor={varName} className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                {varName}
              </label>
              <input
                type="text"
                id={varName}
                value={variables[varName] || ''}
                onChange={(e) => handleVariableChange(varName, e.target.value)}
                placeholder={`Enter ${varName}...`}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-400 text-sm bg-gray-700 text-gray-100 placeholder-gray-400 font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}