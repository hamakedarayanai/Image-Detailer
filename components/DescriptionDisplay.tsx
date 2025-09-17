
import React from 'react';

interface DescriptionDisplayProps {
  description: string;
}

const DescriptionDisplay: React.FC<DescriptionDisplayProps> = ({ description }) => {
  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg h-full min-h-[200px] prose prose-invert prose-p:text-text-secondary prose-headings:text-text-primary max-w-none">
      <h2 className="text-2xl font-bold mb-4 border-b border-base-300 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-secondary">
        AI Analysis
      </h2>
      {description ? (
        <p className="whitespace-pre-wrap leading-relaxed">{description}</p>
      ) : (
        <p className="text-text-secondary italic">
          The generated description will appear here once you upload an image and click "Generate".
        </p>
      )}
    </div>
  );
};

export default DescriptionDisplay;
