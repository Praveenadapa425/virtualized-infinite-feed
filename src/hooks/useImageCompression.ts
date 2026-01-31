import { useState, useCallback } from 'react';
import { compressImage, CompressionOptions } from '../utils/imageCompression';

export const useImageCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);

  const compress = useCallback(async (file: File, options?: CompressionOptions) => {
    setIsCompressing(true);
    setCompressionError(null);

    try {
      const compressedFile = await compressImage(file, options);
      return compressedFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Compression failed';
      setCompressionError(errorMessage);
      throw error;
    } finally {
      setIsCompressing(false);
    }
  }, []);

  return {
    compress,
    isCompressing,
    compressionError,
    clearError: () => setCompressionError(null),
  };
};