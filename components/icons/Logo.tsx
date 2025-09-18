import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        strokeWidth="1.5"
        {...props}
    >
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a5b4fc', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        {/* Outer circle part */}
        <path stroke="url(#grad1)" strokeLinecap="round" strokeLinejoin="round" d="M21 12.792V13.5a9 9 0 1 1-9-9h.708" />
        {/* Inner lens-like structure */}
        <path stroke="url(#grad1)" strokeLinecap="round" strokeLinejoin="round" d="m15 6-3.09 3.09a3 3 0 0 0 0 4.242L15 16.5" />
        <path stroke="url(#grad1)" strokeLinecap="round" strokeLinejoin="round" d="m18 9-1.59 1.59a1.5 1.5 0 0 0 0 2.122L18 14.25" />
        {/* Bottom arc to complete the 'eye' feel */}
        <path stroke="#4f46e5" strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a9 9 0 0 1 18 0" />
    </svg>
);
