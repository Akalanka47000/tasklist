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

export const useAuthStore = create<AuthSlice>()(
  devtools(
    persist(createAuthSlice, {
      name: 'auth-store',
      partialize: (state) => ({ profile: state.profile }),
      storage: createJSONStorage(() => localStorage)
    })
  )
);

const initialState = useAuthStore.getState();

export const resetAuthStore = () =>
  useAuthStore.setState({
    ...initialState,
    profile: undefined
  });
