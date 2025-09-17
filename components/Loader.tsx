
import React from 'react';

interface LoaderProps {
  progress: number;
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  const roundedProgress = Math.round(progress);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-sm">
        <div className="flex items-center gap-3">
            <svg
                className="animate-spin h-8 w-8 text-brand-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                ></circle>
                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <p className="text-text-secondary font-medium text-lg">Analyzing Image...</p>
        </div>

        <div className="w-full bg-base-300 rounded-full h-2.5">
            <div 
            className="bg-brand-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${roundedProgress}%` }}
            ></div>
        </div>
        <p className="text-text-secondary font-semibold tabular-nums">{roundedProgress}%</p>
    </div>
  );
};

export default Loader;
