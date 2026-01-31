import { useState } from 'react'

interface SimpleImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
}

const SimpleImage = ({ src, alt, className = '', fallback = '👤' }: SimpleImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  const handleLoad = () => {
    console.log('Image loaded successfully:', src)
    setDebugInfo('Loaded')
    setIsLoaded(true)
  }

  const handleError = () => {
    console.log('Image failed to load:', src)
    setDebugInfo('Error')
    setHasError(true)
    setIsLoaded(true)
  }

  console.log('SimpleImage render:', { src, isLoaded, hasError, debugInfo })

  // Show fallback if there's an error
  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center border-2 border-dashed border-red-300`}>
        <div className="text-center">
          <span className="text-gray-500 text-xs block">{fallback}</span>
          <span className="text-red-500 text-xs block mt-1">Failed: {debugInfo}</span>
        </div>
      </div>
    )
  }

  // Always show the image, but with loading indicator overlay
  return (
    <div className={`${className} relative border`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-2"></div>
            <span className="text-gray-500 text-xs">Loading...</span>
            <span className="text-gray-400 text-xs mt-1">{debugInfo}</span>
          </div>
        </div>
      )}
      {isLoaded && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl">
          Loaded
        </div>
      )}
    </div>
  )
}

export default SimpleImage