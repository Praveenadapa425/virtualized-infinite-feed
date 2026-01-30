import { create } from 'zustand'

interface PostModalState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const usePostModalStore = create<PostModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen })
}))