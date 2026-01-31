import { Post, User, CreatePostData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Posts API
  async getPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    return this.request<Post[]>(`/posts?_page=${page}&_limit=${limit}`);
  }

  async getPostById(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async likePost(id: string, currentLikes: number, isLiked: boolean): Promise<Post> {
    return this.updatePost(id, {
      likes: isLiked ? currentLikes - 1 : currentLikes + 1,
      isLiked: !isLiked,
    });
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.request<Post[]>(`/posts?userId=${userId}`);
  }

  // Comments API
  async getComments(): Promise<any[]> {
    return this.request<any[]>('/comments');
  }
}

export const apiService = new ApiService();
export default apiService;