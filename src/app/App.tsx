import {
  createMuiTheme,
  CssBaseline,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import BottomTabs from "../components/BottomTabs/BottomTabs";
import TopBar from "../components/TopBar/TopBar";
import { fetchCountries } from "../features/countries/countriesSlice";
import Map from "../features/map/Map";
import SideBar from "../features/sideBar/SideBar";
import useStyles from "./app.styles";

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme: Theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
        overrides: {
          MuiCssBaseline: {
            "@global": {
              "#root": {
                height: "100%",
                width: "100%",
                position: "fixed",
                boxSizing: "border-box",
              },
              "*:focus": {
                outline: "none",
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <TopBar />
        <BottomTabs
          tabs={[
            {
              label: "Table",
              panel: <SideBar />,
            },
            {
              label: "Map",
              panel: <Map />,
            },
          ]}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
