import { useState } from 'react'

interface SimpleImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
}

const SimpleImage = ({ src, alt, className = '', fallback = '👤' }: SimpleImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [key, setKey] = useState(0)

  const handleError = () => {
    console.log('Image error:', src)
    setHasError(true)
  }

  const handleLoad = () => {
    console.log('Image loaded:', src)
    setHasError(false)
  }

  // Force re-render if src changes
  if (src && !src.includes(key.toString())) {
    setKey(prev => prev + 1)
  }

  // Show fallback if there's an error
  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center border-2 border-dashed border-red-300`}>
        <div className="text-center">
          <span className="text-gray-500 text-xs block">{fallback}</span>
          <span className="text-red-500 text-xs block mt-1">Failed to load</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative border`}>
      {/* Actual image - always rendered */}
      <img
        key={`${src}-${key}`}
        src={src}
        alt={alt}
        className="w-full h-full opacity-100"
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      
      {/* Loaded indicator */}
      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl">
        ✓
      </div>
    </div>
  )
}

export default SimpleImage