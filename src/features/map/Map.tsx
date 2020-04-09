import React, { useState, useRef, memo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import MapGL, {
  Source,
  Layer,
  InteractiveMap,
  FlyToInterpolator,
  InteractiveMapProps,
} from "react-map-gl";
import { Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getInOurPais,
  getTimelineExpression,
  COLORS_BY_FILTER_TYPE,
} from "./mapUtils";
import { selectViewPort } from "./mapSlice";
import {
  selectMomentTimelineDate,
  selectFilterBy,
} from "../sideBar/sideBarSlice";
import {
  selectlCountriesByTimelineFC,
  selectCountriesByName,
} from "../countries/countriesSlice";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { Status, Country, CountriesByName } from "../countries/countriesTypes";
import { Nullable } from "../../genericTypes";

import styles from "./Map.module.css";

function Map() {
  const mapRef = useRef<InteractiveMap>(null);
  const initialViewport = useSelector(selectViewPort);
  const [viewport, setViewport] = useState<Partial<InteractiveMapProps>>(
    initialViewport
  );
  const [hoveredCountry, setHoveredCountry] = useState<{
    country: Nullable<Country>;
    offsetX: number;
    offsetY: number;
  }>({
    country: null,
    offsetX: 0,
    offsetY: 0,
  });
  const countriesByName: CountriesByName = useSelector(selectCountriesByName);
  const featureCollection = useSelector(selectlCountriesByTimelineFC);
  const filterBy: Status = useSelector(selectFilterBy);
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const hasCasesExpression = getTimelineExpression("has", date, filterBy);
  const getCasesExpression = getTimelineExpression("get", date, filterBy);
  const onHover = useCallback(
    ({ features = [], srcEvent: { offsetX, offsetY } }) => {
      const feature: Feature = features.find((f: any) =>
        ["label", "point"].includes(f.layer.id)
      );

      if (feature && feature.properties && feature.properties.country) {
        if (hoveredCountry.country !== feature.properties.country) {
          return setHoveredCountry({
            offsetX,
            offsetY,
            country: countriesByName[feature.properties.country],
          });
        }
      } else {
        if (hoveredCountry.country) {
          return setHoveredCountry({
            offsetX: 0,
            offsetY: 0,
            country: null,
          });
        }
      }
    },
    [countriesByName, hoveredCountry]
  );

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
        onHover={onHover}
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
              "circle-color": COLORS_BY_FILTER_TYPE[filterBy],
              "circle-opacity": 0.4,
              "circle-stroke-width": 1,
              "circle-stroke-color": COLORS_BY_FILTER_TYPE[filterBy],
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
        {hoveredCountry.country ? (
          <div
            className={styles.tooltip}
            style={{
              top: hoveredCountry.offsetY,
              left: hoveredCountry.offsetX,
            }}
          >
            <b>{hoveredCountry.country.country}</b>
            <div>
              <span>Confirmed:</span>
              <span style={{ color: COLORS_BY_FILTER_TYPE[Status.Comfirmed] }}>
                {hoveredCountry.country.timeline[Status.Comfirmed][
                  date
                ]?.toLocaleString() || 0}
              </span>
            </div>
            <div>
              <span>Deaths:</span>
              <span style={{ color: COLORS_BY_FILTER_TYPE[Status.Deaths] }}>
                {hoveredCountry.country.timeline[Status.Deaths][
                  date
                ]?.toLocaleString() || 0}
              </span>
            </div>
            <div>
              <span>Recovered:</span>
              <span style={{ color: COLORS_BY_FILTER_TYPE[Status.Recovered] }}>
                {hoveredCountry.country.timeline[Status.Recovered][
                  date
                ]?.toLocaleString() || 0}
              </span>
            </div>
            <div>
              <span>Active:</span>
              <span style={{ color: COLORS_BY_FILTER_TYPE[Status.Active] }}>
                {hoveredCountry.country.timeline[Status.Active][
                  date
                ]?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        ) : null}
      </MapGL>
    </div>
  );
}

export default memo(Map);
