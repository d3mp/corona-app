import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import countries from "../features/countries/countriesSlice";
import map from "../features/map/mapSlice";
import sideBar from "../features/sideBar/sideBarSlice";

export const store = configureStore({
  reducer: {
    countries,
    map,
    sideBar,
  },
  middleware: getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
