import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/rootReducer";
import { Viewport } from "./mapTypes";

export interface MapState {
  viewport: Viewport;
}

const initialState: MapState = {
  viewport: {
    longitude: 0,
    latitude: 15,
    zoom: 1.5,
  },
};

// Slice

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setViewport: (state, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },
  },
});

// Selectors

export const selectViewPort = (state: RootState) => state.map.viewport;

export const { setViewport } = mapSlice.actions;
export default mapSlice.reducer;
