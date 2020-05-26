import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import _ from "lodash";
import moment, { Moment } from "moment";
import { SortDirection, SortDirectionType } from "react-virtualized";
import * as CoronaAPI from "../../api/corona";
import { RootState } from "../../app/store";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { HashMap, Nullable } from "../../genericTypes";
import {
  selectFilterBy,
  selectMomentTimelineDate,
  selectSearchValue,
  selectSortBy,
  selectSortDirection,
} from "../sideBar/sideBarSlice";
import { FilterBy } from "../sideBar/sideBarTypes";
import {
  CountriesByName,
  Country,
  Status,
  TotalByCountry,
} from "./countriesTypes";

// Async actions

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async () => await CoronaAPI.getCountries()
);

// Slice

interface CountriesState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  countriesByName: CountriesByName;
  favoriteCountries: HashMap<boolean>;
  error: Nullable<SerializedError>;
}

const initialState: CountriesState = {
  loading: "idle",
  countriesByName: {},
  favoriteCountries: {},
  error: null,
};

export const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.favoriteCountries[action.payload]) {
        delete state.favoriteCountries[action.payload];
      } else {
        state.favoriteCountries[action.payload] = true;
      }
    },
    updateFavoriteCountries: (
      state,
      action: PayloadAction<HashMap<boolean>>
    ) => {
      state.favoriteCountries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        if (state.loading === "idle") {
          state.loading = "pending";
        }
      })
      .addCase(
        fetchCountries.fulfilled,
        (state, action: PayloadAction<CountriesByName>) => {
          if (state.loading === "pending") {
            state.loading = "idle";
          }

          state.countriesByName = action.payload;
        }
      )
      .addCase(fetchCountries.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Selectors

export const selectCountriesByName = (state: RootState) =>
  state.countries.countriesByName;

export const selectFavoriteCountries = (state: RootState) =>
  state.countries.favoriteCountries;

export const selectCountries = createSelector(
  [selectCountriesByName],
  (countriesByName: CountriesByName) => Object.values(countriesByName)
);

export const selectFilteredCountries = createSelector(
  [selectCountries, selectSearchValue, selectFilterBy, selectFavoriteCountries],
  (
    countries: Country[],
    searchValue: string,
    filterBy: FilterBy,
    favoriteCountries: HashMap<boolean>
  ) => {
    const searchValueLowerCase = searchValue.toLowerCase();
    return countries.filter((country: Country) => {
      // Filter by search
      if (
        searchValue &&
        !country.country.toLowerCase().includes(searchValueLowerCase)
      ) {
        return false;
      }

      // Filter by favorite
      if (filterBy.favorite && !favoriteCountries[country.country]) {
        return false;
      }

      return true;
    });
  }
);

export const selectFilteredWithTimelineCountries = createSelector(
  [selectFilteredCountries, selectMomentTimelineDate],
  (countries: Country[], timelineDate: Moment) => {
    const date: string = timelineDate.format(SHORT_DATE_FORMAT);

    return countries.filter((country: Country) => {
      return (
        country.timeline.active[date] ||
        country.timeline.confirmed[date] ||
        country.timeline.deaths[date] ||
        country.timeline.recovered[date]
      );
    });
  }
);

export const selectFilteredAndOrderedCountries = createSelector(
  [
    selectFilteredWithTimelineCountries,
    selectMomentTimelineDate,
    selectSortBy,
    selectSortDirection,
  ],
  (
    countries: Country[],
    timelineDate: Moment,
    sortBy: string,
    sortDirection: SortDirectionType
  ) => {
    const date: string = timelineDate.format(SHORT_DATE_FORMAT);
    const isSortByStatus = Object.values(Status as any).includes(sortBy);

    return _.orderBy(
      countries,
      (country: Country) => {
        if (isSortByStatus) {
          return country.timeline[sortBy as Status][date] || 0;
        }

        return country[sortBy as keyof Country];
      },
      sortDirection === SortDirection.ASC ? "asc" : "desc"
    ).map((country, index) => ({ ...country, index: index + 1 }));
  }
);

export const selectFilteredSumData = createSelector(
  [selectFilteredWithTimelineCountries, selectMomentTimelineDate],
  (countries: Country[], timelineDate: Moment) => {
    const defaultValues: TotalByCountry = {
      active: 0,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
    };
    const date: string = timelineDate.format(SHORT_DATE_FORMAT);

    return countries.reduce((total: TotalByCountry, country: Country) => {
      return {
        active: total.active + (country.timeline.active[date] || 0),
        confirmed: total.confirmed + (country.timeline.confirmed[date] || 0),
        deaths: total.deaths + (country.timeline.deaths[date] || 0),
        recovered: total.recovered + (country.timeline.recovered[date] || 0),
      };
    }, defaultValues);
  }
);

export const selectlFilteredCountriesFC = createSelector(
  [selectFilteredWithTimelineCountries, selectFilterBy],
  (countries: Country[], filterBy) => {
    const featuerCollection: GeoJSON.FeatureCollection<
      GeoJSON.Point,
      Country
    > = {
      type: "FeatureCollection",
      features: countries.map((country) => {
        const feature: GeoJSON.Feature<GeoJSON.Point, any> = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              country.coordinates.longitude,
              country.coordinates.latitude,
            ],
          },
          properties: {
            country: country.country,
            // Dates added to the root of properties because otherwise
            // it will be a JSON and circle hovering will not work
            ...country.timeline[filterBy.status as Status],
          },
        };

        return feature;
      }),
    };

    return featuerCollection;
  }
);

export const selectFilteredStartTimelineDate = createSelector(
  [selectFilteredCountries],
  (countries: Country[]) => {
    return countries.reduce((startDate: Moment, curr: Country) => {
      const confirmedKeys = Object.keys(curr.timeline[Status.Confirmed]);

      if (confirmedKeys.length) {
        const minDate = moment(confirmedKeys[0], SHORT_DATE_FORMAT);

        if (startDate.isAfter(minDate)) {
          return minDate;
        }
      }

      return startDate;
    }, moment());
  }
);

export const {
  toggleFavorite,
  updateFavoriteCountries,
} = countriesSlice.actions;
export default countriesSlice.reducer;
