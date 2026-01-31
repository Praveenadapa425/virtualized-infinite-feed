import { memo } from 'react';

interface LikeButtonProps {
  isLiked: boolean;
  likes: number;
  onClick: () => void;
}

const LikeButton = memo(({ isLiked, likes, onClick }: LikeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 transition-colors ${
        isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <svg
        className="w-6 h-6"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
});

export default LikeButton;