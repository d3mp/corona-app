import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  root: {
    boxShadow: "none",
    borderRadius: 0,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  tabs: {
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: "solid",
  },
  tab: {
    flex: 1,
  },
  tabLabel: {
    textTransform: "capitalize",
  },
  indicator: {
    top: 0,
  },
  panels: {
    height: "100%",
    position: "relative",
  },
  panel: {
    height: 0,
  },
}));
