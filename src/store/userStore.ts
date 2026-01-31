import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isAuthenticated: false,
  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
}));

// Mock current user for demonstration
export const mockCurrentUser: User = {
  id: '1',
  username: 'current_user',
  avatarUrl: 'https://i.pravatar.cc/150?u=current',
};