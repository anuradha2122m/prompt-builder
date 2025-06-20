import { Prompt, PromptCardData } from '@/types/prompt';
import prompts from '../../prompts.json';

export function getAllPrompts(): Prompt[] {
  // Remove duplicates based on ID
  const uniquePrompts = new Map<string, Prompt>();
  (prompts as Prompt[]).forEach((prompt) => {
    uniquePrompts.set(prompt.id, prompt);
  });
  return Array.from(uniquePrompts.values());
}

export function getPromptById(id: string): Prompt | undefined {
  const allPrompts = getAllPrompts();
  return allPrompts.find((prompt: Prompt) => prompt.id === id);
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  const allPrompts = getAllPrompts();
  allPrompts.forEach((prompt: Prompt) => {
    prompt.categories.forEach(category => {
      // Filter out extremely long category names that might be malformed data
      if (category && category.length < 100) {
        // Normalize categories: trim whitespace and standardize case
        const normalizedCategory = category.trim();
        if (normalizedCategory) {
          categories.add(normalizedCategory);
        }
      }
    });
  });
  
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
  
  const allCategoriesArray = Array.from(categories);
  const remainingCategories = allCategoriesArray.filter(cat => 
    !priorityCategories.includes(cat.trim())
  ).sort();
  
  // Combine priority + remaining categories
  return [...priorityCategories.filter(cat => allCategoriesArray.includes(cat)), ...remainingCategories];
}

export function getAllModels(): string[] {
  const models = new Set<string>();
  const allPrompts = getAllPrompts();
  allPrompts.forEach((prompt: Prompt) => {
    if (prompt.model_parameters.models) {
      prompt.model_parameters.models.forEach(model => models.add(model));
    }
  });
  return Array.from(models).sort();
}

export function getPromptsByCategory(category: string): Prompt[] {
  const allPrompts = getAllPrompts();
  return allPrompts.filter((prompt: Prompt) => 
    prompt.categories.some(cat => cat.trim() === category)
  );
}

export function getFeaturedPrompts(): Prompt[] {
  const allPrompts = getAllPrompts();
  return allPrompts.filter((prompt: Prompt) => prompt.is_featured);
}

export function getRecentPrompts(limit: number = 12): Prompt[] {
  const allPrompts = getAllPrompts();
  return [...allPrompts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export function getPopularPrompts(limit: number = 12): Prompt[] {
  const allPrompts = getAllPrompts();
  return [...allPrompts]
    .sort((a, b) => b.copy_count - a.copy_count)
    .slice(0, limit);
}

export function searchPrompts(query: string): Prompt[] {
  const searchTerm = query.toLowerCase();
  const allPrompts = getAllPrompts();
  return allPrompts.filter((prompt: Prompt) => 
    prompt.title.toLowerCase().includes(searchTerm) ||
    prompt.description.toLowerCase().includes(searchTerm) ||
    prompt.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
    prompt.prompt_text.toLowerCase().includes(searchTerm)
  );
}

export function convertToCardData(prompt: Prompt): PromptCardData {
  return {
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    categories: prompt.categories,
    models: prompt.model_parameters.models || [],
    is_featured: prompt.is_featured
  };
}