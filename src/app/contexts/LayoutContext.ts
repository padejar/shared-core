import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type SidebarShown = boolean | "" | "responsive" | undefined;

type LayoutContextType = {
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: Dispatch<SetStateAction<boolean>>;
  showSidebar: SidebarShown;
  setShowSidebar: Dispatch<SetStateAction<SidebarShown>>;
};

export const LayoutContext = createContext<LayoutContextType>({
  isSidebarMinimized: false,
  setIsSidebarMinimized: (
    previousState: boolean | ((previousState: boolean) => boolean)
  ) => previousState,
  showSidebar: "responsive",
  setShowSidebar: (
    previousState:
      | SidebarShown
      | ((previousState: SidebarShown) => SidebarShown)
  ) => previousState,
});
export const useLayoutContext = (): LayoutContextType =>
  useContext(LayoutContext);
