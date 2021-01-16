import { makeStyles, Theme } from "@material-ui/core";

export const timelineHeight: number = 100;

export default makeStyles((theme: Theme) => ({
  root: {
    minHeight: timelineHeight,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: "solid",
    zIndex: theme.zIndex.drawer,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      "& .MuiSlider-markLabel": {
        top: 26,

        "&:nth-child(4n+1)": {
          top: -13,
        },
      },
    },
    "& .MuiBox-root": {
      paddingTop: theme.spacing(2),
    },
    "& .MuiSlider-root": {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  label: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
    userSelect: "none",
    [theme.breakpoints.down("sm")]: {
      padding: `0 ${theme.spacing(1)}px`,
    },
  },
  arrowButton: {
    width: 32,
    height: 32,
  },
}));
