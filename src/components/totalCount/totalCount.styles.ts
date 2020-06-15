import { makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    textAlign: "center",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.8,
    },
  },
  label: {
    fontSize: theme.typography.body2.fontSize,
  },
  quantity: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));
