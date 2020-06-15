import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../features/sideBar/sideBarSlice";
import useStyles from "./topBar.styles";

const TopBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <AppBar className={classes.appBar} color="primary" position="static">
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title} variant="h6" noWrap>
          Corona App
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={(e) => dispatch(setSearchValue(e.target.value))}
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
