import { useState } from 'react';
import { Shield } from 'lucide-react';

interface GymImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  badge?: string;
}

export function GymImage({ src, alt, className = '', badge }: GymImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#141419] flex items-center justify-center ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Styled Fallback Container if error or while loading */}
      {(!isLoaded || hasError) && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#18181f] via-[#121217] to-[#0a0a0d] border border-white/5 transition-opacity ${
          hasError ? 'opacity-100' : 'opacity-60'
        }`}>
          {/* Subtle red ambient glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-2 text-red-500 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 line-clamp-1">
            {alt}
          </span>
          <span className="text-[10px] text-neutral-500 tracking-wider uppercase mt-1">
            KNOCKOUT ACADEMY
          </span>
        </div>
      )}

      {/* Optional badge overlay */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white rounded shadow-md">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
