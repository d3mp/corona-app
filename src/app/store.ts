import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { rootReducer } from "./rootReducer";

export default () => {
  const storeConfig = {
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  };

  const store = configureStore(storeConfig);
  const persistor = persistStore(store);

  return { store, storeConfig, persistor };
};
