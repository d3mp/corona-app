import clsx from "clsx";
import React, { useContext } from "react";
import { Theme, ThemeContext } from "../../common/theme/ThemeContext";
import styles from "./ThemeSwitch.module.scss";

function ThemeSwitch() {
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <label className={styles.themeSwitch}>
      <input
        type="checkbox"
        checked={theme === Theme.Dark}
        onChange={() =>
          switchTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)
        }
      />
      <span
        className={clsx(styles.icon, theme === Theme.Dark && styles.iconDark)}
        aria-label="Switch theme"
        role="img"
      >
        💡
      </span>
    </label>
  );
}

export { ThemeSwitch };
