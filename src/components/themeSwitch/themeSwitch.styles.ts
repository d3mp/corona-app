import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    fontSize: theme.typography.body1.fontSize,
    padding: 8,
    bottom: 30,
    cursor: "pointer",
    userSelect: "none",
    touchAction: "none",
  },
  checkbox: {
    display: "none",
  },
  icon: {
    userSelect: "none",
    touchAction: "none",
  },
  iconDark: {
    cursor: "pointer",
    userSelect: "none",
    "-webkit-filter": "grayscale(100%)",
    filter: "grayscale(100%)",
  },
}));
