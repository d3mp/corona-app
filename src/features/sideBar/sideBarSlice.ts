import moment from "moment";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SortDirectionType, SortDirection } from "react-virtualized";

export type FilterType = "cases" | "deaths" | "recovered" | "active";

interface SideBarState {
  filterType: FilterType;
  sortBy: string;
  sortDirection: SortDirectionType;
  timelineDate: string; // default moment format
}

const initialState: SideBarState = {
  filterType: "cases",
  sortBy: "todayCases",
  sortDirection: SortDirection.DESC,
  timelineDate: moment().format(),
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<FilterType>) => {
      state.filterType = action.payload;
    },
    setTimelineDate: (state, action: PayloadAction<string>) => {
      state.timelineDate = action.payload;
    },
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
});

// Selectors

export const selectSortBy = (state: RootState) => state.sideBar.sortBy;
export const selectSortDirection = (state: RootState) =>
  state.sideBar.sortDirection;
export const selectTimelineDate = (state: RootState) =>
  state.sideBar.timelineDate;
export const selectFilterType = (state: RootState) => state.sideBar.filterType;

export const selectMomentTimelineDate = createSelector(
  [selectTimelineDate],
  (timelineDate: string) => moment(timelineDate)
);

export const { setFilterType, setTimelineDate, sort } = sideBarSlice.actions;
export default sideBarSlice.reducer;
