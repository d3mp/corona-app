import { SortDirection, SortDirectionType } from "react-virtualized";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { RootState } from "../../app/store";
import {
  Country,
  CountryTimeline,
  TotalByCountry,
  CountriesByName,
  CountriesTimelineByName,
} from "./countriesTypes";
import { population } from "../../common/data/population";
import moment, { Moment } from "moment";
import * as CoronaAPI from "../../api/corona";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import {
  selectSortBy,
  selectSortDirection,
  selectMomentTimelineDate,
} from "../sideBar/sideBarSlice";

// Async actions

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => await CoronaAPI.getCountries()
);

export const fetchCountriesTimeline = createAsyncThunk(
  "countries/fetchCountriesTimeline",
  async () => await CoronaAPI.getCountriesTimeline()
);

// Slice

interface CountriesState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  countriesByName: CountriesByName;
  countriesTimelineByName: CountriesTimelineByName;
  error: Error | null;
}

const initialState: CountriesState = {
  loading: "idle",
  countriesByName: {},
  countriesTimelineByName: {},
  error: null,
};

export const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCountries.pending, (state) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });

    builder.addCase(
      fetchCountries.fulfilled,
      (state, action: PayloadAction<Country[]>) => {
        if (state.loading === "pending") {
          state.loading = "idle";
        }

        state.countriesByName = action.payload.reduce(
          (prev, curr) => ({ ...prev, [curr.country]: curr }),
          {}
        );
      }
    );

    builder.addCase(fetchCountries.rejected, (state, action) => {
      // TODO: handle errors
      // state.error = action.payload;
    });

    builder.addCase(fetchCountriesTimeline.pending, (state) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });

    builder.addCase(fetchCountriesTimeline.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
      }

      state.countriesTimelineByName = action.payload.reduce(
        (prev, curr) => ({ ...prev, [curr.country]: curr }),
        {}
      );
    });

    builder.addCase(fetchCountriesTimeline.rejected, (state, action) => {
      // TODO: handle errors
      // state.error = action.payload;
    });
  },
});

// Selectors

export const selectCountriesByName = (state: RootState) =>
  state.countries.countriesByName;
export const selectCountriesTimelineByName = (state: RootState) =>
  state.countries.countriesTimelineByName;

export const selectCountries = createSelector(
  [selectCountriesByName],
  (countriesByName: CountriesByName) => Object.values(countriesByName)
);

export const selectlDataFeatureCollection = createSelector(
  [selectCountries],
  (countries: Country[]) => {
    const featuerCollection: GeoJSON.FeatureCollection<
      GeoJSON.Point,
      Country
    > = {
      type: "FeatureCollection",
      features: countries
        .filter((country) => country.countryInfo._id)
        .map((country) => {
          const feature: GeoJSON.Feature<GeoJSON.Point, Country> = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [country.countryInfo.long, country.countryInfo.lat],
            },
            properties: {
              ...country,
              countryInfo: {
                ...country.countryInfo,
                population: population[country.country],
              },
            },
          };

          return feature;
        }),
    };

    return featuerCollection;
  }
);

export const selectDataWithTimelineFeatureCollcetion = createSelector(
  [selectlDataFeatureCollection, selectCountriesTimelineByName],
  (
    featureCollcetion: GeoJSON.FeatureCollection<GeoJSON.Point, Country>,
    countriesTimelineByName: CountriesTimelineByName
  ) => {
    const currentDate = moment().format(SHORT_DATE_FORMAT);
    const historicalByCountry = countriesTimelineByName;

    const featureCollcetionWithTimeline: GeoJSON.FeatureCollection<
      GeoJSON.Point,
      Country
    > = {
      ...featureCollcetion,
      features: featureCollcetion.features.map(
        (feature: GeoJSON.Feature<GeoJSON.Point, Country>) => {
          const country: CountryTimeline =
            historicalByCountry[feature.properties.country];

          return Object.assign({}, feature, {
            properties: Object.assign({}, feature.properties, {
              timeline: {
                cases: Object.assign({}, country && country.timeline.cases, {
                  [currentDate]: feature.properties.cases,
                }),
                deaths: Object.assign({}, country && country.timeline.deaths, {
                  [currentDate]: feature.properties.deaths,
                }),
                recovered: Object.assign(
                  {},
                  country && country.timeline.recovered,
                  {
                    [currentDate]: feature.properties.recovered,
                  }
                ),
              },
            }),
          });
        }
      ),
    };

    return featureCollcetionWithTimeline;
  }
);

export const selectCountriesByTimeline = createSelector(
  [selectCountries, selectMomentTimelineDate],
  (countries: Country[], timelinDate: Moment) => {
    return;
  }
);

export const selectCountriesByTimelineDate = createSelector(
  [selectCountries, selectCountriesTimelineByName, selectMomentTimelineDate],
  (
    countries: Country[],
    countriesTimelineByName: CountriesTimelineByName,
    timelinDate: Moment
  ) => {
    const date: string = timelinDate.format(SHORT_DATE_FORMAT);
    const today: Moment = moment();

    return countries.reduce((countries: Country[], country: Country) => {
      const countryTimeline =
        countriesTimelineByName[country.country]?.timeline || undefined;

      if (timelinDate.isSame(today, "day")) {
        countries.push({
          ...country,
          todayCases: country.cases,
          todayDeaths: country.deaths,
          todayRecovered: country.recovered,
        });
      } else if (countryTimeline) {
        if (
          (countryTimeline.cases && countryTimeline.cases[date]) ||
          (countryTimeline.deaths && countryTimeline.deaths[date]) ||
          (countryTimeline.recovered && countryTimeline.recovered[date])
        ) {
          countries.push({
            ...country,
            todayCases: countryTimeline.cases[date] || 0,
            todayDeaths: countryTimeline.deaths[date] || 0,
            todayRecovered: countryTimeline.recovered[date] || 0,
          });
        }
      }

      return countries;
    }, []);
  }
);

export const selectSortedCountriesByTimelineDate = createSelector(
  [selectCountriesByTimelineDate, selectSortBy, selectSortDirection],
  (countries: Country[], sortBy: string, sortDirection: SortDirectionType) => {
    return _.orderBy(
      countries,
      sortBy,
      sortDirection === SortDirection.ASC ? "asc" : "desc"
    ).map((country, index) => ({ ...country, index: index + 1 }));
  }
);

export const selectSumDataByTimelineDate = createSelector(
  [selectCountriesByTimelineDate],
  (countries: Country[]) => {
    const defaultValues: TotalByCountry = {
      active: 0,
      cases: 0,
      deaths: 0,
      recovered: 0,
    };

    return countries.reduce((prev: TotalByCountry, country: Country) => {
      return {
        active:
          prev.active +
          (country.todayCases - country.todayDeaths - country.todayRecovered),
        cases: prev.cases + country.todayCases,
        deaths: prev.deaths + country.todayDeaths,
        recovered: prev.recovered + country.todayRecovered,
      };
    }, defaultValues);
  }
);

export default countriesSlice.reducer;
