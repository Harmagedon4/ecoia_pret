import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-card p-4 text-center">
      <p className="text-sm text-muted-foreground">
        © 2024 ECOIA. Tous droits réservés. | 
        <a 
          href="https://ecoia.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-1 text-primary hover:underline"
        >
          ecoia.io
        </a>
      </p>
    </footer>
  );
};