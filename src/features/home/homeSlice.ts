import { SortDirection, SortDirectionType } from "react-virtualized";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { RootState } from "../../app/store";
import { Country, CountryTimeline, TotalByCountry } from "./homeTypes";
import { population } from "../../common/data/population";
import moment from "moment";
import { CoronaAPI } from "../../api/corona";

// Async actions

export const fetchCountries = createAsyncThunk(
  "home/fetchCountries",
  async () => await CoronaAPI.getCountries()
);

export const fetchCountriesTimeline = createAsyncThunk(
  "home/fetchCountriesTimeline",
  async () => await CoronaAPI.getCountriesTimeline()
);

// Slice

interface HomeState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  countries: Country[];
  countriesTimeline: CountryTimeline[];
  error: Error | null;
  sortDirection: SortDirectionType;
  sortBy: string;
}

const initialState: HomeState = {
  loading: "idle",
  countries: [],
  countriesTimeline: [],
  error: null,
  sortDirection: SortDirection.ASC,
  sortBy: "country",
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    sort: (
      state,
      action: PayloadAction<{
        sortBy: string;
        sortDirection: SortDirectionType;
      }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
  },
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

        state.countries = action.payload;
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

      state.countriesTimeline = action.payload;
    });

    builder.addCase(fetchCountriesTimeline.rejected, (state, action) => {
      // TODO: handle errors
      // state.error = action.payload;
    });
  },
});

export const { sort } = homeSlice.actions;

// Selectors

export const selectCountries = (state: RootState) => state.home.countries;
export const selectCountriesTimeline = (state: RootState) =>
  state.home.countriesTimeline;
export const selectSortBy = (state: RootState) => state.home.sortBy;
export const selectSortDirection = (state: RootState) =>
  state.home.sortDirection;

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
  [selectlDataFeatureCollection, selectCountriesTimeline],
  (
    featureCollcetion: GeoJSON.FeatureCollection<GeoJSON.Point, Country>,
    countriesTimeline: CountryTimeline[]
  ) => {
    const currentDate = moment().format("M/D/YY");
    const historicalByCountry = _.keyBy(countriesTimeline, "country");

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

export const selectSumData = createSelector(
  [selectCountries],
  (countries: Country[]) => {
    const defaultValues: TotalByCountry = {
      active: 0,
      cases: 0,
      critical: 0,
      deaths: 0,
      recovered: 0,
      todayCases: 0,
      todayDeaths: 0,
    };

    return countries.reduce((prev: TotalByCountry, country: Country) => {
      return {
        active: prev.active + country.active,
        cases: prev.cases + country.cases,
        critical: prev.critical + country.critical,
        deaths: prev.deaths + country.deaths,
        recovered: prev.recovered + country.recovered,
        todayCases: prev.todayCases + country.todayCases,
        todayDeaths: prev.todayDeaths + country.todayDeaths,
      };
    }, defaultValues);
  }
);

export const selectDataWithPercentage = createSelector(
  [selectCountries],
  (data: Country[]) =>
    data.map((country: Country) => {
      const casesWithoutDeaths = country.cases - country.deaths;

      return {
        ...country,
        casesWithoutDeaths,
        recoveredPercentage: casesWithoutDeaths
          ? country.recovered
            ? +((country.recovered / casesWithoutDeaths) * 100).toFixed(2)
            : 0
          : 100,
      };
    })
);

export const selectSortedData = createSelector(
  [selectDataWithPercentage, selectSortBy, selectSortDirection],
  (data: any[], sortBy: string, sortDirection: SortDirectionType) => {
    return _.orderBy(
      data,
      sortBy,
      sortDirection === SortDirection.ASC ? "asc" : "desc"
    ).map((country, index) => ({ ...country, index: index + 1 }));
  }
);

export default homeSlice.reducer;
