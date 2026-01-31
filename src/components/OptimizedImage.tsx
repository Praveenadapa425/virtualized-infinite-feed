import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

const OptimizedImage = ({ src, alt, className = '', placeholder }: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setHasError(false)
    setImageLoaded(false)

    if (!src) {
      setIsLoading(false)
      return
    }

    // Create new image object to handle loading
    const img = new Image()
    img.src = src
    
    const handleLoad = () => {
      setImageLoaded(true)
      setIsLoading(false)
    }
    
    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
    }
    
    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    
    // If image is already cached
    if (img.complete && img.naturalWidth !== 0) {
      handleLoad()
    }
    
    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src])

  // Show placeholder while loading
  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        {placeholder && (
          <span className="text-gray-500 text-xs">{placeholder}</span>
        )}
      </div>
    )
  }

  // Show error state
  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border border-dashed border-gray-300`}>
        <span className="text-gray-400 text-xs">⚠️</span>
      </div>
    )
  }

  // Show actual image when loaded
  if (imageLoaded) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    )
  }

  // Fallback - should not reach here
  return (
    <div className={`${className} bg-gray-200 flex items-center justify-center`}>
      <span className="text-gray-500 text-xs">?</span>
    </div>
  )
}

export default OptimizedImage