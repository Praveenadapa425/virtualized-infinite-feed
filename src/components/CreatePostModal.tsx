import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { usePostModalStore } from '../store/modalStore'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Array of Unsplash image URLs for new posts
const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1418065460487-3a61e6dc3dbd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop'
]

const CreatePostModal = () => {
  const { isOpen, setIsOpen } = usePostModalStore()
  const { mutate } = useSWRConfig()
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caption.trim()) return

    setIsSubmitting(true)
    try {
      // Select a random image from our Unsplash collection
      const randomImage = UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)]
      
      const postData = {
        userId: 1, // Default user ID for demo
        imageUrl: randomImage,
        caption: caption,
        likes: 0,
        isLiked: false
      };

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) throw new Error('Failed to create post')

      // Clear form and close modal
      setCaption('')
      setIsOpen(false)

      // Revalidate posts
      mutate((key: any) => typeof key === 'string' && key.includes('/posts'), undefined, { revalidate: true })

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
            <label className="block text-sm font-medium mb-2">Image Preview</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
              <p className="text-gray-500">New posts will include real images from Unsplash</p>
              <p className="text-xs text-gray-400 mt-1">Random landscape photo will be selected</p>
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
              disabled={isSubmitting || !caption.trim()}
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