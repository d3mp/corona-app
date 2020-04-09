import React, { useEffect } from "react";
import Map from "../features/map/Map";
import { useDispatch } from "react-redux";
import { SideBar } from "../features/sideBar/SideBar";
import { fetchCountries } from "../features/countries/countriesSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <div className="App">
      <SideBar />
      <Map />
      {/* <MapBox /> */}
    </div>
  );
}

export default App;
