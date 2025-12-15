import React from 'react';

export type CategoryType = 'Men' | 'Women' | 'Couple' | 'All';

export interface Prompt {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  likes: number;
  style?: string;
}

export interface NavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
}