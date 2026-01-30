import imageCompression from 'browser-image-compression'

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  
  return await imageCompression(file, options)
}

// Make it globally accessible for verification
(window as any).compressImage = compressImage