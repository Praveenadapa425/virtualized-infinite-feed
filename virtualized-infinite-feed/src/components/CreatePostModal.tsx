import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { compressImage } from '../utils/imageCompression'
import { useSWRConfig } from 'swr'
import { usePostModalStore } from '../store/modalStore'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const CreatePostModal = () => {
  const { isOpen, setIsOpen } = usePostModalStore()
  const { mutate } = useSWRConfig()
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setImage(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !caption) return

    setIsSubmitting(true)
    try {
      // Compress image
      const compressedFile = await compressImage(image)

      const formData = new FormData()
      formData.append('image', compressedFile)
      formData.append('caption', caption)

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to create post')

      // Clear form and close modal
      setCaption('')
      setImage(null)
      setPreview(null)
      setIsOpen(false)

      // Revalidate posts
      mutate((key: any) => typeof key === 'string' && key.includes('/posts'))

      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
              ) : (
                <p>Drag & drop an image here, or click to select one</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !image || !caption}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal