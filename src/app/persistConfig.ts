import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

export const saveSubsetFilter = createFilter("countries", [
  "favoriteCountries",
]);

export const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["countries"],
  transforms: [saveSubsetFilter],
};
