import React from 'react';

export interface NavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
  source?: 'contact' | 'service';
  isDeleted?: boolean;
  deletedAt?: string;
  serviceDetails?: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  desc: string;
  tags: string[];
  image: string;
  images?: string[];
  video?: string;
  videos?: string[];
  link: string;
  type: 'main' | 'portfolio' | 'figma' | 'client';
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
}

export interface N8nProject {
  id: string;
  title: string;
  category?: string;
  desc: string;
  tags: string[];
  workflowJson: string;
  nodeCount?: number;
  testWorkflowUrl?: string;
  allowClientRequest?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
}

export interface N8nProjectForm {
  id: string;
  projectId: string;
  projectTitle: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}
