import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapGL, { Source, Layer } from "react-map-gl";
import moment from "moment";
import {
  fetchDataByCounties,
  selectDataWithTimelineFeatureCollcetion,
  fetchHistoricalData,
} from "../home/homeSlice";
import ControlPanel from "./ControlPanel";

import "mapbox-gl/dist/mapbox-gl.css";

export function Map() {
  const dispatch = useDispatch();
  const [date, setDate] = useState(moment().format("M/D/YY"));
  const [viewport, setViewport] = useState({
    latitude: 50,
    longitude: 15,
    zoom: 1,
    bearing: 0,
    pitch: 0,
  });
  const featureCollection = useSelector(
    selectDataWithTimelineFeatureCollcetion
  );

  useEffect(() => {
    dispatch(fetchDataByCounties());
    dispatch(fetchHistoricalData());
  }, [dispatch]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <MapGL
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken="pk.eyJ1IjoiZGVtcGtoIiwiYSI6ImNrOGZwanFuazAxdnozbG4yNm1tOHVuYzkifQ.fRJrCsndLJ4yM-jlPaAG9Q"
      >
        <Source id="data" type="geojson" data={featureCollection}>
          <Layer
            id="point"
            type="circle"
            filter={[
              "all",
              ["has", date, ["get", "cases", ["get", "timeline"]]],
              [">", ["get", date, ["get", "cases", ["get", "timeline"]]], 0],
            ]}
            paint={{
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", date, ["get", "cases", ["get", "timeline"]]],
                ...getSteps(),
              ],
              "circle-color": "#FF5733",
              "circle-opacity": 0.4,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#FF5733",
            }}
          />
          <Layer
            id="label"
            type="symbol"
            filter={[
              "all",
              ["has", date, ["get", "cases", ["get", "timeline"]]],
              [">", ["get", date, ["get", "cases", ["get", "timeline"]]], 0],
            ]}
            paint={{
              "text-color": "#EBEBEB",
            }}
            layout={{
              "text-field": [
                "get",
                date,
                ["get", "cases", ["get", "timeline"]],
              ],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            }}
          />
        </Source>
      </MapGL>
      <ControlPanel onChange={(date) => setDate(date.format("M/D/YY"))} />
    </div>
  );
}

function getSteps(max: number = 1000000) {
  const steps = [0, 1, 5, 10, 50, 100, 500, 1000, 2000];

  for (let step = 5000; step <= max; step += 5000) {
    steps.push(step);

    if (step >= 100000) {
      step += 5000;
    }

    if (step >= 200000) {
      step += 15000;
    }
  }

  return steps.reduce((steps: number[], step: number, index) => {
    return [...steps, step, index + 2 * 2];
  }, []);
}
