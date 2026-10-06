import React, { useState } from 'react';

interface RennerLogoProps {
  className?: string;
  size?: number | string;
  withText?: boolean;
}

export const RennerLogo: React.FC<RennerLogoProps> = ({
  className = 'w-10 h-10',
  size,
  withText = false
}) => {
  const [imgError, setImgError] = useState(false);

  // Logo source from user request: https://ibb.co/m5r4NKTT (direct image https://i.ibb.co/chKQY933/images.jpg and local /public/renner-logo.jpg)
  const localLogoSrc = '/renner-logo.jpg';
  const onlineFallbackSrc = 'https://i.ibb.co/chKQY933/images.jpg';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0 rounded-xl overflow-hidden shadow-sm border border-emerald-600/30 bg-emerald-900 flex items-center justify-center"
        style={size ? { width: size, height: size } : { width: '100%', height: '100%' }}
      >
        {!imgError ? (
          <img
            src={localLogoSrc}
            alt="Logo Renner Syariah"
            className="w-full h-full object-cover rounded-xl transition-transform hover:scale-105"
            onError={(e) => {
              // Try fallback to remote URL if local load fails
              const target = e.currentTarget;
              if (target.src !== onlineFallbackSrc) {
                target.src = onlineFallbackSrc;
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          /* High-fidelity Vector fallback in case image file cannot be loaded */
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="rennerGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B7940" />
                <stop offset="50%" stopColor="#086835" />
                <stop offset="100%" stopColor="#044D26" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="url(#rennerGreenGrad)" />
            <path
              d="M60 40 H115 C145 40 160 58 160 80 C160 102 145 118 115 120 H86 V160 H60 V40 Z M86 62 V98 H112 C128 98 136 88 136 80 C136 72 128 62 112 62 H86 Z"
              fill="#FFFFFF"
            />
            <path d="M106 112 L142 160 H114 L86 122 H106 Z" fill="#FDE047" />
          </svg>
        )}
      </div>

      {withText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-slate-900 dark:text-slate-100 tracking-tight text-base font-['Outfit']">
              PATEN <span className="text-emerald-700 dark:text-emerald-400">AGRO</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              RENNER SYARIAH
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            PT. Renner Inti Internasional
          </p>
        </div>
      )}
    </div>
  );
};

