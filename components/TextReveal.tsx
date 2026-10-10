import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

// Animates text character by character while keeping each word unbreakable,
// so lines only wrap between words (never mid-word).
const TextReveal: React.FC<TextRevealProps> = ({ text, className = '', delay = 200 }) => {
  const words = text.split(' ');
  let charIndex = 0;
  return (
    <p className={`${className} inline-block`}>
      {words.map((word, w) => {
        const chars = word.split('').map((char) => {
          const i = charIndex++;
          return (
            <span
              key={i}
              className="inline-block opacity-0 animate-fade-up"
              style={{ animationDelay: `${delay + i * 20}ms`, animationFillMode: 'forwards' }}
            >
              {char}
            </span>
          );
        });
        charIndex++; // account for the space so timing matches the original
        return (
          <React.Fragment key={w}>
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {w < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default TextReveal;
