
import type { themeState } from "@/types/store";
import {create} from "zustand"
import { persist } from "zustand/middleware";

export const useThemeStore = create<themeState>()(
persist(
    (set,get)=>({
        isDarkMode: false,

       toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
       setTheme: (isDark: boolean) => set({ isDarkMode: isDark }),
    }
    ),{
        name: "theme-storage",

    }
)
)