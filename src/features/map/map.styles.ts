import { makeStyles, Theme } from "@material-ui/core";
import { drawerWidth } from "../sideBar/sideBar.styles";

export default makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    width: `calc(100% - ${drawerWidth})`,
    position: "absolute",
    left: drawerWidth,
    right: 0,
    [theme.breakpoints.down("sm")]: {
      left: 0,
    },
  },
}));
