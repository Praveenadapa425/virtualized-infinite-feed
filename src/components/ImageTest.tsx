import { useState, useEffect } from 'react'

const ImageTest = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  
  useEffect(() => {
    const testUrls = [
      'https://placehold.co/600x400/4F46E5/FFFFFF?text=Test1',
      'https://placehold.co/600x400/EF4444/FFFFFF?text=Test2',
      'https://i.pravatar.cc/150?u=test1',
      'https://i.pravatar.cc/150?u=test2'
    ]
    
    const results: any[] = []
    
    testUrls.forEach((url, index) => {
      const img = new Image()
      
      const handleLoad = () => {
        console.log('Test image loaded:', url)
        results.push({
          url,
          status: 'loaded',
          width: img.naturalWidth,
          height: img.naturalHeight,
          index
        })
        setTestResults([...results])
      }
      
      const handleError = (error: any) => {
        console.log('Test image failed:', url, error)
        results.push({
          url,
          status: 'error',
          error: error?.type || 'unknown',
          index
        })
        setTestResults([...results])
      }
      
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
      img.src = url
      
      // Immediate check for cached images
      if (img.complete) {
        if (img.naturalWidth > 0) {
          handleLoad()
        } else {
          handleError(new Error('Zero width'))
        }
      }
    })
  }, [])
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-800 mb-2">Image Loading Test</h3>
      <div className="space-y-2">
        {testResults.map((result) => (
          <div key={result.index} className="text-sm p-2 bg-white rounded">
            <div className="flex items-center">
              <span className={result.status === 'loaded' ? 'text-green-600' : 'text-red-600'}>
                {result.status === 'loaded' ? '✓' : '✗'}
              </span>
              <span className="ml-2 font-mono text-xs truncate flex-1">{result.url}</span>
            </div>
            {result.status === 'loaded' && (
              <div className="text-gray-500 text-xs mt-1">
                {result.width}×{result.height}
              </div>
            )}
            {result.status === 'error' && (
              <div className="text-red-500 text-xs mt-1">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageTest