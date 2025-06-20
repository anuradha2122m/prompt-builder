export interface ModelParameters {
  top_p: number | null;
  models: string[];
  max_tokens: number | null;
  temperature: number | null;
  presence_penalty: number | null;
  frequency_penalty: number | null;
  additional_instructions: string | null;
}

export interface StructuredData {
  system: string;
  messages: unknown[];
}

export interface Profile {
  username: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  description: string;
  prompt_text: string;
  categories: string[];
  rating: number;
  fork_count: number;
  original_prompt_id: string | null;
  model_parameters: ModelParameters;
  created_at: string;
  updated_at: string;
  variables: unknown;
  model_settings: ModelParameters;
  is_featured: boolean;
  copy_count: number;
  external_use_count: number;
  structured_data: StructuredData | null;
  prompt_format: string;
  is_private: boolean;
  profiles: Profile;
}

export interface PromptCardData {
  id: string;
  title: string;
  description: string;
  categories: string[];
  models: string[];
  is_featured: boolean;
}

export interface FilterOptions {
  categories: string[];
  models: string[];
  sortBy: 'newest' | 'popular' | 'rating' | 'alphabetical';
}