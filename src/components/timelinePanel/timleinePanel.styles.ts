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

    "& .MuiSlider-root": {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },

    "@media (pointer: coarse)": {
      "& .MuiSlider-root": {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },

      "& .MuiSlider-markLabel": {
        top: 26,
      },
    },
  },
  label: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
  },
}));
