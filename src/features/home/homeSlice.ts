import { SortDirection, SortDirectionType } from "react-virtualized";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import _ from "lodash";
import { RootState } from "../../app/store";
import { HistoricalData, Country, TotalByCountry } from "./homeTypes";
import { population } from "../../common/data/population";
import moment from "moment";

// Async actions

export const fetchDataByCounties = createAsyncThunk(
  "home/fetchDataByCountries",
  async () => {
    const response = await fetch(
      "https://corona.lmao.ninja/countries?sort=country"
    );
    const data = await response.json();

    return data;
  }
);

export const fetchHistoricalData = createAsyncThunk(
  "home/fetchHistoicalData",
  async () => {
    const response = await fetch("https://corona.lmao.ninja/v2/historical");
    const data: HistoricalData[] = await response.json();

    return data;
  }
);

// Slice

interface HomeState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: [];
  historicalData: HistoricalData[];
  error: Error | null;
  sortDirection: SortDirectionType;
  sortBy: string;
}

const initialState: HomeState = {
  loading: "idle",
  data: [],
  historicalData: [],
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
    builder.addCase(fetchDataByCounties.pending, (state) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });

    builder.addCase(fetchDataByCounties.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
      }

      state.data = action.payload;
    });

    builder.addCase(fetchDataByCounties.rejected, (state, action) => {
      // if (action.payload) {
      //     // Since we passed in `MyKnownError` to `rejectType` in `updateUser`, the type information will be available here.
      //     state.error = action.payload.errorMessage
      //   } else {
      //     state.error = action.error
      //   }
    });

    builder.addCase(fetchHistoricalData.pending, (state) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });

    builder.addCase(fetchHistoricalData.fulfilled, (state, action) => {
      if (state.loading === "pending") {
        state.loading = "idle";
      }

      state.historicalData = action.payload;
    });

    builder.addCase(fetchHistoricalData.rejected, (state, action) => {
      // if (action.payload) {
      //     // Since we passed in `MyKnownError` to `rejectType` in `updateUser`, the type information will be available here.
      //     state.error = action.payload.errorMessage
      //   } else {
      //     state.error = action.error
      //   }
    });
  },
});

export const { sort } = homeSlice.actions;

// Selectors

export const selectData = (state: RootState) => state.home.data;
export const selectHistoricalData = (state: RootState) =>
  state.home.historicalData;
export const selectSortBy = (state: RootState) => state.home.sortBy;
export const selectSortDirection = (state: RootState) =>
  state.home.sortDirection;

export const selectlDataFeatureCollection = createSelector(
  [selectData],
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
  [selectlDataFeatureCollection, selectHistoricalData],
  (
    featureCollcetion: GeoJSON.FeatureCollection<GeoJSON.Point, Country>,
    historicalData: HistoricalData[]
  ) => {
    const currentDate = moment().format("M/D/YY");
    const historicalByCountry = _.keyBy(historicalData, "country");

    const featureCollcetionWithTimeline: GeoJSON.FeatureCollection<
      GeoJSON.Point,
      Country
    > = {
      ...featureCollcetion,
      features: featureCollcetion.features.map(
        (feature: GeoJSON.Feature<GeoJSON.Point, Country>) => {
          const country: HistoricalData =
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
  [selectData],
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
  [selectData],
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
