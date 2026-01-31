import { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import useSWRInfinite from 'swr/infinite';
import { usePostModalStore } from '../../store/modalStore';
import { useUserStore, mockCurrentUser } from '../../store/userStore';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';
import CreatePostModal from '../../components/modals/CreatePostModal';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { Link } from 'react-router-dom';
import UserAvatar from '../../components/common/UserAvatar';

import { Post, User } from '../../types';

const PAGE_SIZE = 10;

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, setIsOpen } = usePostModalStore();
  const { setCurrentUser, setIsAuthenticated } = useUserStore();

  // Set mock current user on component mount
  useEffect(() => {
    setCurrentUser(mockCurrentUser);
    setIsAuthenticated(true);
  }, [setCurrentUser, setIsAuthenticated]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
  
  const getKey = useCallback((pageIndex: number, previousPageData: Post[] | null) => {
    if (previousPageData && !previousPageData.length) return null;
    return [`${API_BASE_URL}/posts?_page=${pageIndex + 1}&_limit=${PAGE_SIZE}`, pageIndex];
  }, []);

  const { data, error, isLoading, setSize, size } = useSWRInfinite(
    getKey,
    async (key: [string, number]) => {
      const [url] = key;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    {
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  );

  const flattenedPosts = useMemo(() => (data ? data.flat() : []), [data]);
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  useEffect(() => {
    if (data) {
      setPosts(flattenedPosts);
    }
  }, [data, flattenedPosts]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const loadMoreItems = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [isReachingEnd, isLoadingMore, setSize, size]);

  const isItemLoaded = useCallback((index: number) => {
    return !!posts[index];
  }, [posts]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = posts[index];
    if (!post) return <div style={style}></div>;
    
    const user = users.find(u => u.id === post.userId);
    
    return (
      <div style={style} className="px-4 py-2">
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
    );
  }, [posts, users]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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
          Failed to load posts. Please try again.
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
  );
};

export default Feed;