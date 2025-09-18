import React from 'react';
import { Logo } from './icons/Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-secondary">
              Image Detailer AI
            </h1>
          </div>
          <p className="mt-2 text-md text-text-secondary">
            Upload an image to get a complete and detailed analysis.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;