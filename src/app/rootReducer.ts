import { Action, ThunkAction } from "@reduxjs/toolkit";
import { persistCombineReducers } from "redux-persist";
import countries from "../features/countries/countriesSlice";
import map from "../features/map/mapSlice";
import sideBar from "../features/sideBar/sideBarSlice";
import { persistConfig } from "./persistConfig";

export const rootReducer = persistCombineReducers(persistConfig, {
  countries,
  map,
  sideBar,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
