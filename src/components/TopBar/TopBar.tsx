import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { useDispatch } from "react-redux";
import useDebounce from "../../common/hooks/useDebounce";
import { setSearchValue } from "../../features/sideBar/sideBarSlice";
import useStyles from "./topBar.styles";

const TopBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debouncedValue, _, setValue] = useDebounce<string>("", 500);

  useEffect(() => {
    if (debouncedValue) {
      ReactGA.event({
        action: "Filter By Name",
        category: "Countries",
        label: debouncedValue,
      });
    }
  }, [debouncedValue]);

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
            onChange={(e) => {
              setValue(e.target.value);
              dispatch(setSearchValue(e.target.value));
            }}
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
