import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    getAccessTokenFromStorage: () => string | null;
    hydrated: boolean;
    setHydrated: (v: boolean) => void;
}

const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (token: string) => set({ accessToken: token }),
            getAccessTokenFromStorage: () => {
                try {
                    const storage = localStorage.getItem('admin-storage');
                    if (!storage) return null;
                    const parsed = JSON.parse(storage);
                    return parsed.state?.accessToken ?? null;
                } catch {
                    return null;
                }
            },
            hydrated: false,
            setHydrated: (v: boolean) => set({ hydrated: v })
        }),
        {
            name: 'admin-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            }
        }
    )
);

export default useAdminStore;