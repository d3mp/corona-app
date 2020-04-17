import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Theme, ThemeContext } from "../common/theme/ThemeContext";
import { getBrowserTheme } from "../common/theme/themeUtils";
import { fetchCountries } from "../features/countries/countriesSlice";
import Map from "../features/map/Map";
import { SideBar } from "../features/sideBar/SideBar";
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
