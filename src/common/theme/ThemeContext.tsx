import React, { useLayoutEffect, useState } from "react";
import { Nullable } from "../../genericTypes";
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
  const defaultTheme: Theme =
    (localStorage.getItem("theme") as Nullable<Theme>) || getBrowserTheme();
  const [theme, switchTheme] = useState(defaultTheme);

  useLayoutEffect(() => {
    const prevTheme: string = theme === Theme.Dark ? Theme.Light : Theme.Dark;
    const root = document.getElementsByTagName("html")[0];
    root.className = root.className.includes(theme)
      ? root.className
      : root.className.includes(prevTheme)
      ? root.className.replace(prevTheme, theme)
      : root.className.split(" ").concat(theme).join(" ");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
