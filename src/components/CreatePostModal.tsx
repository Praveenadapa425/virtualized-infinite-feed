import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { usePostModalStore } from '../store/modalStore'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
      // For demo purposes, we'll send a simple JSON post
      // In a real app, you'd handle image upload differently
      
      const postData = {
        userId: 1, // Default user ID for demo
        imageUrl: 'https://picsum.photos/seed/' + Date.now() + '/600/400',
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
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
              <p className="text-gray-500">Image upload demo - using placeholder image</p>
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