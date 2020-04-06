import moment, { Moment } from "moment";
import _ from "lodash";
import { SortDirection, SortDirectionType } from "react-virtualized";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  Country,
  TotalByCountry,
  CountriesByName,
  CountriesTimelineByName,
} from "./countriesTypes";
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
  error: SerializedError | null;
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
    builder
      .addCase(fetchCountries.pending, (state) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(
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
      )
      .addCase(fetchCountries.rejected, (state, action) => {
        state.error = action.error;
      });

    builder
      .addCase(fetchCountriesTimeline.pending, (state) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(fetchCountriesTimeline.fulfilled, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
        }

        state.countriesTimelineByName = action.payload.reduce(
          (prev, curr) => ({ ...prev, [curr.country]: curr }),
          {}
        );
      })
      .addCase(fetchCountriesTimeline.rejected, (state, action) => {
        state.error = action.error;
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
        countries.push(country);
      } else if (countryTimeline) {
        const cases = countryTimeline.cases[date] || 0;
        const deaths = countryTimeline.deaths[date] || 0;
        const recovered = countryTimeline.recovered[date] || 0;
        const active = cases - deaths - recovered;

        if (cases || deaths || recovered || active) {
          countries.push({
            ...country,
            cases,
            deaths,
            recovered,
            active,
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
        active: prev.active + country.active,
        cases: prev.cases + country.cases,
        deaths: prev.deaths + country.deaths,
        recovered: prev.recovered + country.recovered,
      };
    }, defaultValues);
  }
);

export const selectlCountriesByTimelineFC = createSelector(
  [selectCountriesByTimelineDate],
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
            properties: country,
            // properties: {
            //   ...country,
            //   countryInfo: {
            //     ...country.countryInfo,
            //     population: population[country.country],
            //   },
            // },
          };

          return feature;
        }),
    };

    return featuerCollection;
  }
);

export default countriesSlice.reducer;
