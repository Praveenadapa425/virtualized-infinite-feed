import { useState, useEffect, useRef } from 'react'

interface SimpleImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
}

const SimpleImage = ({ src, alt, className = '', fallback = '👤' }: SimpleImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset state completely when src changes
  useEffect(() => {
    // Force complete reset of all states
    setHasError(false);
    setIsLoaded(false);
    setIsTimeout(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!src) {
      setHasError(true);
      return;
    }
 
    // Set a timeout to show fallback if image takes too long to load
    timeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
      setIsLoaded(true);
    }, 10000); // 10 seconds timeout
  }, [src]); // Only depend on src

  // Clean up timeout when component unmounts or when image loads
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Show fallback if there's an error
  if (hasError || isTimeout) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center border-2 border-dashed border-red-300`}>
        <div className="text-center">
          <span className="text-gray-500 text-xs block">{fallback}</span>
          <span className="text-red-500 text-xs block mt-1">{hasError ? 'Failed to load image' : 'Image took too long to load'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative border`}>
      {/* Key prop forces complete re-render when src changes - CRITICAL for react-window */}
      <img
        key={src} // This is the key fix for react-window virtualization
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsLoaded(true);
        }}
        onError={(_e) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setHasError(true);
          setIsLoaded(true);
        }}
      />
      
      {/* Loading overlay - only shown when not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs text-gray-600">Loading image...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleImage