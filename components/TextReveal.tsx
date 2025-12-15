import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({ text, className = '', delay = 200 }) => {
  return (
    <p className={`${className} inline-block`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-fade-up"
          style={{
            animationDelay: `${delay + i * 20}ms`,
            animationFillMode: 'forwards',
            minWidth: char === ' ' ? '4px' : 'auto'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </p>
  );
};

export default TextReveal;