import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import sideBar from "../features/sideBar/sideBarSlice";
import countries from "../features/countries/countriesSlice";

export const store = configureStore({
  reducer: {
    countries,
    sideBar,
  },
  middleware: getDefaultMiddleware({ immutableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
