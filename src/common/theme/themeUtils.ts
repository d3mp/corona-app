import { Theme } from "./ThemeContext";

export function getBrowserTheme(): Theme {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.Dark
    : Theme.Light;
}
