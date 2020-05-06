import React, { useLayoutEffect } from "react";
import { Nullable } from "../../genericTypes";
import useLocalStorage from "../hooks/useLocalStorage";
import { getBrowserTheme } from "./themeUtils";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface ThemeContext {
  theme: Nullable<Theme>;
  switchTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContext>({
  theme: null,
  switchTheme: (theme: Theme) => {},
});

interface ThemeContextProviderProps {
  children: React.ReactNode | ((theme: Theme) => Theme);
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, switchTheme] = useLocalStorage<Theme>(
    "theme",
    getBrowserTheme()
  );

  useLayoutEffect(() => {
    const prevTheme: string = theme === Theme.Dark ? Theme.Light : Theme.Dark;
    const root = document.getElementsByTagName("html")[0];
    root.className = root.className.includes(theme)
      ? root.className
      : root.className.includes(prevTheme)
      ? root.className.replace(prevTheme, theme)
      : root.className.split(" ").concat(theme).join(" ");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
