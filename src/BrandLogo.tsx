import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const height = size === 'sm' ? 'h-9 sm:h-10' : size === 'lg' ? 'h-16 sm:h-20' : 'h-12 sm:h-14';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* 1:1 Vector SVG matching user's uploaded logo image.png with distinct separated leaves */}
      <svg 
        role="img"
        aria-label="Kirjastus SAAGU VALGUS"
        viewBox="0 0 540 180" 
        className={`${height} w-auto`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="LogoIcon">
          {/* 9 Light Sage Green Sun Rays */}
          <g stroke="#95B89C" strokeWidth="2.8" strokeLinecap="round">
            {/* Center vertical ray */}
            <line x1="110" y1="56" x2="110" y2="10" strokeWidth="3.2" />
            {/* Left rays */}
            <line x1="102" y1="58" x2="80" y2="18" />
            <line x1="95" y1="62" x2="52" y2="30" />
            <line x1="90" y1="68" x2="28" y2="48" />
            <line x1="88" y1="76" x2="12" y2="72" />
            {/* Right rays */}
            <line x1="118" y1="58" x2="140" y2="18" />
            <line x1="125" y1="62" x2="168" y2="30" />
            <line x1="130" y1="68" x2="192" y2="48" />
            <line x1="132" y1="76" x2="208" y2="72" />
          </g>

          {/* Light Sage Green Sun Ring Arc */}
          <path 
            d="M 90 68 A 20 20 0 0 1 130 68" 
            stroke="#95B89C" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Open Book / Palm Fan Leaves with Clean White Separation Gaps */}
          {/* Vertical Spine Leaf */}
          <path 
            d="M 108 148 C 108 110, 107 65, 110 40 C 113 65, 112 110, 112 148 Z" 
            fill="#1A5C33" 
          />

          {/* Left Leaves (1 to 4 from inside to outside) */}
          <path 
            d="M 106 148 C 96 115, 88 80, 84 55 C 93 62, 101 98, 108 148 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 104 146 C 82 120, 62 90, 52 70 C 66 75, 90 102, 106 146 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 102 144 C 68 125, 40 102, 24 88 C 41 86, 76 108, 104 144 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 100 142 C 58 135, 26 120, 6 116 C 20 106, 60 116, 102 142 Z" 
            fill="#1A5C33" 
          />

          {/* Right Leaves (1 to 4 from inside to outside) */}
          <path 
            d="M 114 148 C 124 115, 132 80, 136 55 C 127 62, 119 98, 112 148 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 116 146 C 138 120, 158 90, 168 70 C 154 75, 130 102, 114 146 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 118 144 C 152 125, 180 102, 196 88 C 179 86, 144 108, 116 144 Z" 
            fill="#1A5C33" 
          />
          <path 
            d="M 120 142 C 162 135, 194 120, 214 116 C 200 106, 160 116, 118 142 Z" 
            fill="#1A5C33" 
          />

          {/* Bottom Stem Base */}
          <path 
            d="M 104 148 C 104 158, 116 158, 116 148 Z" 
            fill="#1A5C33" 
          />
        </g>

        {/* Logo Text Section */}
        <g id="LogoText">
          {/* Cursive Script "Kirjastus" */}
          <text 
            x="240" 
            y="68" 
            fill="#1A5C33" 
            fontSize="62" 
            fontWeight="bold" 
            fontFamily="'Caveat', 'Dancing Script', 'Brush Script MT', cursive"
            letterSpacing="1"
          >
            Kirjastus
          </text>

          {/* Bold Sans-Serif "SAAGU" */}
          <text 
            x="242" 
            y="118" 
            fill="#95B89C" 
            fontSize="48" 
            fontWeight="900" 
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="3"
          >
            SAAGU
          </text>

          {/* Heavy Bold Sans-Serif "VALGUS" */}
          <text 
            x="242" 
            y="166" 
            fill="#1A5C33" 
            fontSize="52" 
            fontWeight="950" 
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            letterSpacing="3"
          >
            VALGUS
          </text>
        </g>
      </svg>
    </div>
  );
};
