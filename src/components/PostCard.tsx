import { useSWRConfig } from 'swr'
import { toast } from 'react-hot-toast'
import LikeButton from './LikeButton'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

interface Post {
  id: string
  userId: string
  imageUrl: string
  caption: string
  likes: number
  isLiked: boolean
}

interface User {
  id: string
  username: string
  avatarUrl: string
}

interface PostCardProps {
  post: Post
  users: User[]
}

const PostCard = ({ post, users }: PostCardProps) => {
  const { mutate } = useSWRConfig()
  const user = users.find(u => u.id === post.userId)

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        })
      })

      if (!response.ok) throw new Error('Failed to update like')

      // Optimistic update
      mutate(
        (key: any) => typeof key === 'string' && key.includes('/posts'),
        (data: any) => {
          if (!data) return data
          return data.map((page: any) =>
            page.map((p: any) =>
              p.id === post.id
                ? { ...p, likes: post.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
                : p
            )
          )
        },
        { revalidate: true }
      )
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatarUrl || 'https://i.pravatar.cc/150'}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{user?.username || 'Unknown User'}</h3>
          </div>
        </div>
        
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full h-64 object-cover mb-4"
        />
        
        <p className="text-gray-700 mb-4">{post.caption}</p>
        
        <div className="flex items-center space-x-4">
          <LikeButton
            isLiked={post.isLiked}
            likes={post.likes}
            onClick={handleLike}
          />
        </div>
      </div>
    </div>
  )
}

export default PostCard