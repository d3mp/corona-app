import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import countries from "../features/countries/countriesSlice";
import map from "../features/map/mapSlice";
import sideBar from "../features/sideBar/sideBarSlice";

export const storeConfig = {
  reducer: {
    countries,
    map,
    sideBar,
  },
  middleware: getDefaultMiddleware(),
};

export const store = configureStore(storeConfig);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
