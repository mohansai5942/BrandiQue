
import React from 'react';

// Define the available categories for prompt filtering and creation
export type CategoryType = 'All' | 'Men' | 'Women' | 'Couple';

// Define the Prompt interface used throughout the application
export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  category: 'Men' | 'Women' | 'Couple';
  likes: number;
  style?: string;
}

export interface NavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
