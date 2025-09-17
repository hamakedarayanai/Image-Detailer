
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-secondary">
            Image Detailer AI
          </h1>
          <p className="mt-2 text-md text-text-secondary">
            Upload an image to get a complete and detailed analysis.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
