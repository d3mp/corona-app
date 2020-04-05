import moment from "moment";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SortDirectionType, SortDirection } from "react-virtualized";

interface SideBarState {
  sortBy: string;
  sortDirection: SortDirectionType;
  timelineDate: string; // default moment format
}

const initialState: SideBarState = {
  sortBy: "country",
  sortDirection: SortDirection.ASC,
  timelineDate: moment().format(),
};

export const sideBarSlice = createSlice({
  name: "sideBar",
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
    setTimelineDate: (state, action: PayloadAction<string>) => {
      state.timelineDate = action.payload;
    },
  },
});

export const { sort, setTimelineDate } = sideBarSlice.actions;

// Selectors

export const selectSortBy = (state: RootState) => state.sideBar.sortBy;
export const selectSortDirection = (state: RootState) =>
  state.sideBar.sortDirection;
export const selectTimelineDate = (state: RootState) =>
  state.sideBar.timelineDate;

export const selectMomentTimelineDate = createSelector(
  [selectTimelineDate],
  (timelineDate: string) => moment(timelineDate)
);

export default sideBarSlice.reducer;
