import { createContext } from "react";

export type TabsContext = {
  tab: number;
  setTab: (tab: number) => void;
};

export const TabsContext = createContext<TabsContext>({
  tab: 0,
  setTab: () => null,
});
