import React from 'react';

export interface NavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export type CategoryType = 'All' | 'Men' | 'Women' | 'Couple' | string;

export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  category: string;
  likes: number;
  style?: string;
}