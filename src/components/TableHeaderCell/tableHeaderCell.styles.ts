import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  tableHeaderCell: {
    textTransform: "capitalize",
    userSelect: "none",
  },
  tableCell: {
    height: 50,
    width: "100%",
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flex: 1,
    padding: theme.spacing(1),

    [theme.breakpoints.down(550)]: {
      padding: theme.spacing(1) / 2,
      flexDirection: "column-reverse",
    },
    [theme.breakpoints.down(450)]: {
      fontSize: theme.typography.fontSize - 2,
    },
  },
  label: {
    fontSize: "inherit",
  },
}));
