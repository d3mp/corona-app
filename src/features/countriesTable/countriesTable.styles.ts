import { makeStyles, Theme } from "@material-ui/core";

export const headerHeight = 50;
export const rowHeight = 50;

export default makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    boxShadow: "none",
    borderRadius: 0,
  },
  rowColumn: {
    cursor: "pointer",
    display: "flex",
    height: "100%",

    "&.ReactVirtualized__Table__row:hover": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:not(:last-child)": {
      marginRight: 0,
    },
  },
  doubleLine: {
    wordBreak: "break-all",
    whiteSpace: "normal",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
}));
