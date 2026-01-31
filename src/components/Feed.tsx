import { useState, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'
import { usePostModalStore } from '../store/modalStore'
import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import CreatePostModal from './CreatePostModal'
import ErrorBoundary from './ErrorBoundary'
import { Link } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import ImageTest from './ImageTest'

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

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const { isOpen, setIsOpen } = usePostModalStore()

  const PAGE_SIZE = 10

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null
    return `${API_BASE_URL}/posts?_page=${pageIndex + 1}&_limit=${PAGE_SIZE}`
  }

  const { data, error, isLoading, setSize, size } = useSWRInfinite(
    getKey,
    (url: string) => fetch(url).then(res => res.json()),
    {
      revalidateFirstPage: false,
    }
  )

  const flattenedPosts = data ? data.flat() : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

  useEffect(() => {
    if (data) {
      setPosts(flattenedPosts)
    }
  }, [data, flattenedPosts])

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(setUsers)
  }, [])

  const loadMoreItems = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ImageTest />
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create Post
          </button>
        </div>
      </div>

      {isLoadingInitialData ? (
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          Failed to load posts
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {posts.map((post) => {
            const user = users.find(u => u.id === post.userId)
            return (
              <div key={post.id} className="px-4 py-2">
                <ErrorBoundary>
                  <div className="mb-2 flex items-center space-x-2">
                    {user && (
                      <>
                        <UserAvatar 
                          src={user.avatarUrl} 
                          alt={user.username}
                          size="sm"
                        />
                        <Link 
                          to={`/profile/${user.id}`} 
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        >
                          @{user.username}
                        </Link>
                      </>
                    )}
                  </div>
                  <PostCard post={post} users={users} />
                </ErrorBoundary>
              </div>
            )
          })}
          {!isReachingEnd && (
            <div className="text-center p-4">
              <button
                onClick={loadMoreItems}
                disabled={isLoadingMore}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && <CreatePostModal />}
    </div>
  )
}

export default Feed