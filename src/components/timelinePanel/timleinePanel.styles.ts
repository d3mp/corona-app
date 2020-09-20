import { makeStyles, Theme } from "@material-ui/core";

export const timelineHeight: number = 80;

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
    },

    "& .MuiSlider-root": {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },

    "@media (pointer: coarse)": {
      "& .MuiSlider-root": {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
      },

      "& .MuiSlider-markLabel": {
        top: 26,
      },
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
