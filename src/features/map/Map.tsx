import React, { useState, useRef, memo, useEffect } from "react";
import { useSelector } from "react-redux";
import MapGL, {
  Source,
  Layer,
  InteractiveMap,
  FlyToInterpolator,
  InteractiveMapProps,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getInOurPais,
  getTimelineExpression,
  COLORS_BY_FILTER_TYPE,
} from "./mapUtils";
import { selectViewPort } from "./mapSlice";
import {
  selectMomentTimelineDate,
  selectFilterType,
  FilterType,
} from "../sideBar/sideBarSlice";
import { selectlCountriesByTimelineFC } from "../countries/countriesSlice";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";

import styles from "./Map.module.css";

function Map() {
  const mapRef = useRef<InteractiveMap>(null);
  const initialViewport = useSelector(selectViewPort);
  const [viewport, setViewport] = useState<Partial<InteractiveMapProps>>(
    initialViewport
  );
  const featureCollection = useSelector(selectlCountriesByTimelineFC);
  const filterType: FilterType = useSelector(selectFilterType);
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const hasCasesExpression = getTimelineExpression("has", date, filterType);
  const getCasesExpression = getTimelineExpression("get", date, filterType);

  useEffect(() => {
    // fly to the new position
    setViewport({
      ...initialViewport,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: "auto",
    });
  }, [initialViewport]);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxApiAccessToken="pk.eyJ1IjoiZGVtcGtoIiwiYSI6ImNrOGZwanFuazAxdnozbG4yNm1tOHVuYzkifQ.fRJrCsndLJ4yM-jlPaAG9Q"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <Source id="data" type="geojson" data={featureCollection}>
          <Layer
            id="point"
            type="circle"
            filter={["all", hasCasesExpression, [">", getCasesExpression, 0]]}
            paint={{
              "circle-radius": [
                "interpolate",
                ["linear"],
                getCasesExpression,
                ...getInOurPais(),
              ],
              "circle-color": COLORS_BY_FILTER_TYPE[filterType],
              "circle-opacity": 0.4,
              "circle-stroke-width": 1,
              "circle-stroke-color": COLORS_BY_FILTER_TYPE[filterType],
            }}
          />
          <Layer
            id="label"
            type="symbol"
            filter={["all", hasCasesExpression, [">", getCasesExpression, 0]]}
            paint={{
              "text-color": "#EBEBEB",
            }}
            layout={{
              "text-field": getCasesExpression,
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            }}
          />
        </Source>
      </MapGL>
    </div>
  );
}

export default memo(Map);
