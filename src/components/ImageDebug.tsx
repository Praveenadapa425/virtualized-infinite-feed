import { useState, useEffect } from 'react'

const ImageDebug = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  
  useEffect(() => {
    const testImages = [
      'https://i.pravatar.cc/150?u=1',
      'https://i.pravatar.cc/150?u=2',
      'https://i.pravatar.cc/150?u=3'
    ]
    
    const results: any[] = []
    
    testImages.forEach((url) => {
      const img = new Image()
      
      const handleLoad = () => {
        results.push({
          url,
          status: 'loaded',
          width: img.naturalWidth,
          height: img.naturalHeight
        })
        if (results.length === testImages.length) {
          setTestResults([...results])
        }
      }
      
      const handleError = () => {
        results.push({
          url,
          status: 'error'
        })
        if (results.length === testImages.length) {
          setTestResults([...results])
        }
      }
      
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
      img.src = url
    })
  }, [])
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">Image Debug Info</h3>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm">
            <span className={result.status === 'loaded' ? 'text-green-600' : 'text-red-600'}>
              {result.status === 'loaded' ? '✓' : '✗'}
            </span>
            <span className="ml-2 font-mono text-xs">{result.url}</span>
            {result.width && (
              <span className="ml-2 text-gray-500">
                ({result.width}×{result.height})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageDebug