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
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Reset states when src changes
    setHasError(false)
    setIsLoaded(false)
    
    if (!src) {
      console.warn('SimpleImage: Empty src provided')
      setHasError(true)
      return
    }

    // Validate URL format
    try {
      new URL(src)
    } catch (e) {
      console.error('SimpleImage: Invalid URL format:', src)
      setHasError(true)
      return
    }

    // Check if image is already cached
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      console.log('SimpleImage: Image already cached:', src)
      setIsLoaded(true)
      return
    }

    // Set up image loading with timeout
    const img = new Image()
    img.src = src
    
    const handleLoad = () => {
      console.log('SimpleImage: Image loaded successfully:', src)
      setIsLoaded(true)
    }
    
    const handleError = (e: any) => {
      console.error('SimpleImage: Image failed to load:', src, e)
      setHasError(true)
      setIsLoaded(true)
    }
    
    // Add timeout for loading
    const timeoutId = setTimeout(() => {
      console.warn('SimpleImage: Image loading timeout:', src)
      if (!isLoaded && !hasError) {
        setHasError(true)
        setIsLoaded(true)
      }
    }, 10000) // 10 second timeout
    
    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, isLoaded, hasError])

  // Show fallback if there's an error
  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center border-2 border-dashed border-red-300`}>
        <div className="text-center">
          <span className="text-gray-500 text-xs block">{fallback}</span>
          <span className="text-red-500 text-xs block mt-1">Failed to load image</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative border`}>
      {/* Actual image - always rendered and visible */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-100'}`}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          console.log('SimpleImage: onLoad triggered:', src)
          setIsLoaded(true)
        }}
        onError={(e) => {
          console.error('SimpleImage: onError triggered:', src, e)
          setHasError(true)
          setIsLoaded(true)
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
  )
}

export default SimpleImage