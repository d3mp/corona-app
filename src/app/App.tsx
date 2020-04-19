import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThemeContextProvider } from "../common/theme/ThemeContext";
import { fetchCountries } from "../features/countries/countriesSlice";
import Map from "../features/map/Map";
import { SideBar } from "../features/sideBar/SideBar";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <ThemeContextProvider>
      <div className="App">
        <SideBar />
        <Map />
      </div>
    </ThemeContextProvider>
  );
}

export default App;
