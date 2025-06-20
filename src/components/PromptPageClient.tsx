'use client';

import { useState } from 'react';
import PromptDisplayCard from './PromptDisplayCard';
import VariablesSection from './VariablesSection';
import PromptDescriptionCard from './PromptDescriptionCard';

interface PromptPageClientProps {
  promptText: string;
  description: string;
}

export default function PromptPageClient({ promptText, description }: PromptPageClientProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  const handleVariablesChange = (newVariables: Record<string, string>) => {
    setVariables(newVariables);
  };

  return (
    <>
      <PromptDescriptionCard description={description} />
      
      <PromptDisplayCard 
        fullPromptText={promptText}
        variables={variables}
      />
      
      <div className="mt-8">
        <VariablesSection 
          promptText={promptText}
          onVariablesChange={handleVariablesChange}
        />
      </div>
    </>
  );
}