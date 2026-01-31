import { useState, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import useSWRInfinite from 'swr/infinite'
import { usePostModalStore } from '../store/modalStore'
import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import CreatePostModal from './CreatePostModal'

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

  const isItemLoaded = (index: number) => {
    return !!posts[index]
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = posts[index]
    if (!post) return <div style={style}></div>
    
    return (
      <div style={style} className="px-4 py-2">
        <PostCard post={post} users={users} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={isReachingEnd ? posts.length : posts.length + 1}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={window.innerHeight - 100}
              itemCount={posts.length}
              itemSize={500}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={'100%'}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}

      {isOpen && <CreatePostModal />}
    </div>
  )
}

export default Feed