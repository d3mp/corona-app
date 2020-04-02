import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapGL, { Source, Layer } from "react-map-gl";
import moment from "moment";
import {
  fetchCountries,
  fetchCountriesTimeline,
  selectDataWithTimelineFeatureCollcetion,
} from "../home/homeSlice";
import TimelinePanel from "./TimelinePanel";
import { getSteps } from "./mapUtils";

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
    dispatch(fetchCountries());
    dispatch(fetchCountriesTimeline());
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
      <TimelinePanel
        date={moment(date, "M/D/YY")}
        onChange={(date) => setDate(date.format("M/D/YY"))}
        minDate={moment("2020-01-22T00:00:00")}
        maxDate={moment()}
      />
    </div>
  );
}
