import { create, StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthSlice {
  profile?: IUser;
  setProfile: (user: IUser) => void;
}

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile })
});

const name = 'auth-store';

export const useAuthStore = create<AuthSlice>()(
  devtools(
    persist(createAuthSlice, {
      name,
      partialize: (state) => ({ profile: state.profile }),
      storage: createJSONStorage(() => localStorage)
    })
  )
);

const initialState = useAuthStore.getState();

export const resetAuthStore = () => {
  useAuthStore.setState(initialState);
  localStorage.removeItem(name);
};
