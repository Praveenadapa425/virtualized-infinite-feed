import { memo, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'react-hot-toast';
import LikeButton from './LikeButton';
import { apiService } from '../../services/api';
import { Post, User } from '../../types';

interface PostCardProps {
  post: Post;
  users: User[];
}

const PostCard = memo(({ post, users }: PostCardProps) => {
  const { mutate } = useSWRConfig();
  const user = users.find(u => u.id === post.userId);

  const handleLike = useCallback(async () => {
    try {
      // Optimistic update
      mutate(
        (key: any) => typeof key === 'string' && key.includes('/posts'),
        (data: any) => {
          if (!data) return data;
          return data.map((page: any) =>
            page.map((p: any) =>
              p.id === post.id
                ? { 
                    ...p, 
                    likes: post.isLiked ? p.likes - 1 : p.likes + 1, 
                    isLiked: !p.isLiked 
                  }
                : p
            )
          );
        },
        { revalidate: false }
      );

      // Make API call
      await apiService.likePost(post.id, post.likes, post.isLiked);
      
      // Revalidate to ensure consistency
      mutate((key: any) => typeof key === 'string' && key.includes('/posts'));
    } catch (error) {
      // Revert optimistic update on error
      mutate((key: any) => typeof key === 'string' && key.includes('/posts'));
      toast.error('Failed to like post');
    }
  }, [post, mutate]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className="hidden text-gray-500">👤</span>
          </div>
          <div>
            <h3 className="font-semibold">{user?.username || 'Unknown User'}</h3>
          </div>
        </div>
        
        <div className="mb-4">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="hidden w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-gray-500 text-2xl">🖼️</span>
              <p className="text-gray-500 text-sm mt-2">Failed to load image</p>
            </div>
          </div>
        </div>
        
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
  );
});

export default PostCard;