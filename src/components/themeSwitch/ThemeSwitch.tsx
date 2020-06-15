import clsx from "clsx";
import React, { useContext } from "react";
import { Theme, ThemeContext } from "../../common/theme/ThemeContext";
import useStyles from "./themeSwitch.styles";

const ThemeSwitch = () => {
  const classes = useStyles();
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <label className={classes.root}>
      <input
        className={classes.checkbox}
        type="checkbox"
        checked={theme === Theme.Dark}
        onChange={() =>
          switchTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)
        }
      />
      <span
        className={clsx(classes.icon, theme === Theme.Dark && classes.iconDark)}
        aria-label="Switch theme"
        role="img"
      >
        💡
      </span>
    </label>
  );
};

export default ThemeSwitch;
