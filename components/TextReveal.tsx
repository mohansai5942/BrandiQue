import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({ text, className = '', delay = 200 }) => {
  return <p className={className}>{text}</p>;
};
export default TextReveal;