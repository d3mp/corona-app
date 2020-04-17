import { Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { Moment } from "moment";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MapGL, {
  FlyToInterpolator,
  InteractiveMap,
  InteractiveMapProps,
  Layer,
  Source,
} from "react-map-gl";
import { useSelector } from "react-redux";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { Theme, ThemeContext } from "../../common/theme/ThemeContext";
import { Nullable } from "../../genericTypes";
import {
  selectCountriesByName,
  selectlCountriesByTimelineFC,
} from "../countries/countriesSlice";
import { CountriesByName, Country, Status } from "../countries/countriesTypes";
import {
  selectFilterBy,
  selectMomentTimelineDate,
} from "../sideBar/sideBarSlice";
import styles from "./Map.module.css";
import { selectViewPort } from "./mapSlice";
import {
  COLORS_BY_FILTER_TYPE,
  getInOurPais,
  getTimelineExpression,
} from "./mapUtils";
import { Tooltip } from "./tooltip/Tooltip";

function Map() {
  const mapRef = useRef<InteractiveMap>(null);
  const { theme } = useContext(ThemeContext);
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
  const currentMoment: Moment = useSelector(selectMomentTimelineDate);
  const date: string = currentMoment.format(SHORT_DATE_FORMAT);
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
        height="100%"
        mapStyle={`mapbox://styles/mapbox/${theme}-v10`}
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
              "text-color": theme === Theme.Light ? "#3B3B3B" : "#EBEBEB",
            }}
            layout={{
              "text-field": getCasesExpression,
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
            }}
          />
        </Source>
        <Tooltip date={currentMoment} hoveredCountry={hoveredCountry} />
      </MapGL>
    </div>
  );
}

export default memo(Map);
