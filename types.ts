
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
  service: string;
  budget: string;
  message: string;
  createdAt: string;
}
