import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import { persistCombineReducers, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";
import countries from "../features/countries/countriesSlice";
import map from "../features/map/mapSlice";
import sideBar from "../features/sideBar/sideBarSlice";

const saveSubsetFilter = createFilter("countries", ["favoriteCountries"]);

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["countries"],
  transforms: [saveSubsetFilter],
};

const persistedReducer = persistCombineReducers(persistConfig, {
  countries,
  map,
  sideBar,
});

export const storeConfig = {
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    // immutableCheck: false,
    // serializableCheck: false,
  }),
};

export const store = configureStore(storeConfig);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
