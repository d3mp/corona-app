import React from "react";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface ThemeContext {
  theme: Theme;
  switchTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContext>({
  theme: Theme.Dark,
  switchTheme: (theme: Theme) => {},
});
