import moment from "moment";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SortDirectionType, SortDirection } from "react-virtualized";
import { Status } from "../countries/countriesTypes";

interface SideBarState {
  filterBy: Status;
  sortBy: string;
  sortDirection: SortDirectionType;
  timelineDate: string; // ISO format
}

const initialState: SideBarState = {
  filterBy: Status.Comfirmed,
  sortBy: Status.Comfirmed,
  sortDirection: SortDirection.DESC,
  timelineDate: moment().format(),
};

export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<Status>) => {
      state.filterBy = action.payload;
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
export const selectFilterBy = (state: RootState) => state.sideBar.filterBy;

export const selectMomentTimelineDate = createSelector(
  [selectTimelineDate],
  (timelineDate: string) => moment(timelineDate)
);

export const { setFilterType, setTimelineDate, sort } = sideBarSlice.actions;
export default sideBarSlice.reducer;
