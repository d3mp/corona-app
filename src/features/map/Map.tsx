import { useTheme } from "@material-ui/core";
import { Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { Moment } from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapGL, {
  FlyToInterpolator,
  InteractiveMap,
  InteractiveMapProps,
  Layer,
  Source,
} from "react-map-gl";
import { useSelector } from "react-redux";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import Tooltip from "../../components/Tooltip/Tooltip";
import { Nullable } from "../../genericTypes";
import {
  selectCountriesByName,
  selectlFilteredCountriesFC,
} from "../countries/countriesSlice";
import { CountriesByName, Country } from "../countries/countriesTypes";
import {
  selectFilterBy,
  selectMomentTimelineDate,
} from "../sideBar/sideBarSlice";
import { FilterBy } from "../sideBar/sideBarTypes";
import useStyles from "./map.styles";
import { selectViewPort } from "./mapSlice";
import {
  COLORS_BY_FILTER_TYPE,
  getInOurPais,
  getTimelineExpression,
} from "./mapUtils";

const inOurPairs = getInOurPais();

function Map() {
  const classes = useStyles();
  const mapRef = useRef<InteractiveMap>(null);
  const theme = useTheme();
  const initialViewport = useSelector(selectViewPort);
  const [viewport, setViewport] = useState<Partial<InteractiveMapProps>>(
    initialViewport
  );
  const [hoveredCountry, setHoveredCountry] = useState<
    Nullable<{
      country: Country;
      offsetX: number;
      offsetY: number;
    }>
  >(null);
  const countriesByName: CountriesByName = useSelector(selectCountriesByName);
  const featureCollection = useSelector(selectlFilteredCountriesFC);
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const currentMoment: Moment = useSelector(selectMomentTimelineDate);
  const date: string = currentMoment.format(SHORT_DATE_FORMAT);
  const hasCasesExpression = getTimelineExpression("has", date);
  const getCasesExpression = getTimelineExpression("get", date);

  const onHover = useCallback(
    ({ features = [], srcEvent: { offsetX, offsetY } }) => {
      const feature: Feature = features.find((f: any) =>
        ["label", "point"].includes(f.layer.id)
      );

      if (feature && feature.properties && feature.properties.country) {
        if (hoveredCountry?.country !== feature.properties.country) {
          return setHoveredCountry({
            offsetX,
            offsetY,
            country: countriesByName[feature.properties.country],
          });
        }
      } else {
        if (hoveredCountry?.country) {
          return setHoveredCountry(null);
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
    <div className={classes.root}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={`mapbox://styles/mapbox/${theme.palette.type}-v10?optimize=true`}
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
                ...inOurPairs,
              ],
              "circle-color": COLORS_BY_FILTER_TYPE[filterBy.status],
              "circle-opacity": 0.4,
              "circle-stroke-width": 1,
              "circle-stroke-color": COLORS_BY_FILTER_TYPE[filterBy.status],
            }}
          />
          <Layer
            id="label"
            type="symbol"
            filter={["all", hasCasesExpression, [">", getCasesExpression, 0]]}
            paint={{
              "text-color":
                theme.palette.type === "light" ? "#3B3B3B" : "#EBEBEB",
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

export default Map;
