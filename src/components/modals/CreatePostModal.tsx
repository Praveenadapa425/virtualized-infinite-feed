import { useState, useRef, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { useDropzone } from 'react-dropzone';
import { usePostModalStore } from '../../store/modalStore';
import { useUserStore } from '../../store/userStore';
import { useImageCompression } from '../../hooks/useImageCompression';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api';

// Array of placeholder image URLs for new posts
const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/600/400?random=100',
  'https://picsum.photos/600/400?random=101',
  'https://picsum.photos/600/400?random=102',
  'https://picsum.photos/600/400?random=103',
  'https://picsum.photos/600/400?random=104',
  'https://picsum.photos/600/400?random=105',
  'https://picsum.photos/600/400?random=106',
  'https://picsum.photos/600/400?random=107',
  'https://picsum.photos/600/400?random=108',
  'https://picsum.photos/600/400?random=109'
];

const CreatePostModal = () => {
  const { isOpen, setIsOpen } = usePostModalStore();
  const { mutate } = useSWRConfig();
  const { currentUser } = useUserStore();
  const { compress, isCompressing, compressionError } = useImageCompression();
  
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      
      if (selectedFile) {
        // Compress the image
        const compressedFile = await compress(selectedFile);
        // In a real app, you would upload this to a storage service
        // For demo purposes, we'll use a placeholder URL
        imageUrl = URL.createObjectURL(compressedFile);
      } else {
        // Select a random placeholder image
        imageUrl = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      }

      const postData = {
        userId: currentUser.id,
        imageUrl: imageUrl,
        caption: caption,
        likes: 0,
        isLiked: false
      };

      await apiService.createPost(postData);

      // Clear form and close modal
      setCaption('');
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsOpen(false);

      // Revalidate posts
      mutate((key: any) => typeof key === 'string' && key.includes('/posts'), undefined, { revalidate: true });

      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCaption('');
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="What's on your mind?"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image</label>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the image here...</p>
              ) : (
                <div>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Drag & drop an image here, or click to select</p>
                  <p className="text-gray-400 text-sm mt-1">Supports JPG, PNG, GIF up to 5MB</p>
                </div>
              )}
            </div>

            {previewImage && (
              <div className="mt-4">
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {isCompressing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p>Compressing image...</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Image preview</p>
                {compressionError && (
                  <p className="text-xs text-red-500 mt-1">{compressionError}</p>
                )}
              </div>
            )}

            {!previewImage && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 mt-2">
                <p className="text-gray-500">No image selected</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !caption.trim() || isCompressing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;