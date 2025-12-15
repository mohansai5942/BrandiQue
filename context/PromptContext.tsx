import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Prompt } from '../types';
import { PROMPTS_DATA } from '../constants';

interface PromptContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'likes'>) => void;
  updatePrompt: (id: string, updatedPrompt: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with static data
  const [prompts, setPrompts] = useState<Prompt[]>(PROMPTS_DATA);

  const addPrompt = (newPromptData: Omit<Prompt, 'id' | 'likes'>) => {
    const newPrompt: Prompt = {
      ...newPromptData,
      id: Date.now().toString(),
      likes: 0,
    };
    setPrompts([newPrompt, ...prompts]);
  };

  const updatePrompt = (id: string, updatedPrompt: Partial<Prompt>) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, ...updatedPrompt } : p));
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt, updatePrompt, deletePrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};