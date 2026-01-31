export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  email?: string;
}

export interface Comment {
  id: string;
  postId: string | number;
  userId: string | number;
  text: string;
  createdAt?: string;
}

export interface CreatePostData {
  userId: string;
  imageUrl: string;
  caption: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}