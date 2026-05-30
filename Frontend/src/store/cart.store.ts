import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartCourse {
  id: string;
  title: string;
  category?: string;
  hours?: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  thumbnail?: string;
  instructorName?: string;
  instructorBio?: string;
  level?: string;
}

interface CartState {
  cartCount: number;
  isOpen: boolean;
  selectedCourse: CartCourse | null;
  addToCart: (course: CartCourse) => void;
  removeFromCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      isOpen: false,
      selectedCourse: null,
      addToCart: (course) =>
        set({
          cartCount: 1,
          selectedCourse: course,
          isOpen: true,
        }),
      removeFromCart: () =>
        set({
          cartCount: 0,
          selectedCourse: null,
        }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: 'ai-scale-cart',
      partialize: (state) => ({
        cartCount: state.cartCount,
        selectedCourse: state.selectedCourse,
      }),
    }
  )
);
