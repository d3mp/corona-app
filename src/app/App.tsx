import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Map from "../features/map/Map";
import { useDispatch } from "react-redux";
import { SideBar } from "../features/sideBar/SideBar";
import { fetchCountries } from "../features/countries/countriesSlice";
import { ThemeContext, Theme } from "../common/theme/ThemeContext";
import { getBrowserTheme } from "../common/theme/themeUtils";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const defaultTheme: Theme = getBrowserTheme();
  const [theme, switchTheme] = useState(defaultTheme);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      <div className={clsx("App", theme)}>
        <SideBar />
        <Map />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
