import { create } from "zustand";
import type { MenuDTO } from "../types/MenuResponse";
import { persist } from "zustand/middleware";

interface MenuStore {
    menus: MenuDTO[];
    setMenus: (menus: MenuDTO[]) => void;
    clearMenus: () => void;

    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;

    openMenus: number[];
    toggleMenu: (id: number) => void;
    resetOpenMenus: () => void;
}

export const useMenuStore = create<MenuStore>()(
    persist(
        (set, get) => ({
            menus: [],
            setMenus: (menus) => set({ menus }),
            clearMenus: () => set({ menus: [] }),

            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            openMenus: [],
            toggleMenu: (id) => {
                const { openMenus } = get();
                set({
                    openMenus: openMenus.includes(id) ? openMenus.filter((i) => i !== id) : [...openMenus, id],
                });
            },
            resetOpenMenus: () => set({ openMenus: [] }),
        }),
        {
            name: "menu-storage",
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
                openMenus: state.openMenus,
            }),
        }
    )
);
