import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from './PostCard'
import ErrorBoundary from './ErrorBoundary'
import SimpleImage from './SimpleImage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'

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

const Profile = () => {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all users to find the current user
        const usersResponse = await fetch(`${API_BASE_URL}/users`)
        const usersData = await usersResponse.json()
        setUsers(usersData)
        
        const currentUser = usersData.find((u: User) => u.id === userId)
        if (!currentUser) {
          setError('User not found')
          return
        }
        setUser(currentUser)
        
        // Fetch posts for this user
        const postsResponse = await fetch(`${API_BASE_URL}/posts`)
        const allPosts = await postsResponse.json()
        const postsByUser = allPosts.filter((post: Post) => post.userId === userId)
        setUserPosts(postsByUser)
      } catch (err) {
        setError('Failed to load profile data')
        console.error('Error fetching profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-8">Loading profile...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-8 text-red-500">
          {error || 'User not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <SimpleImage
            src={user.avatarUrl}
            alt={user.username}
            className="w-16 h-16 rounded-full"
            fallback="👤"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{userPosts.length} posts</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {userPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts yet
          </div>
        ) : (
          userPosts.map((post) => (
            <ErrorBoundary key={post.id}>
              <PostCard post={post} users={users} />
            </ErrorBoundary>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile