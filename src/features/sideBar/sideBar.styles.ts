import { makeStyles, Theme } from "@material-ui/core";
import { timelineHeight } from "../../components/TimelinePanel/timleinePanel.styles";

export const drawerWidth = 600;

export default makeStyles((theme: Theme) => ({
  body: {
    display: "flex",
    flexDirection: "row",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    height: `calc(100% - ${timelineHeight}px)`,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: `calc(100% - ${timelineHeight + 49}px)`,
    },
  },
}));
