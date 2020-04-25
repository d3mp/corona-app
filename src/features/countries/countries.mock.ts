import { COUNTRIES_URL, HISTORICAL_URL } from "../../api/corona";
import { CountriesByName } from "./countriesTypes";
import { mergeCountriesWithHistoricalData } from "./countriesUtils";
import countriesJson from "./json/countries.json";
import historicalJson from "./json/historical.json";

export { countriesJson, historicalJson };

export const countriesByName: CountriesByName = mergeCountriesWithHistoricalData(
  [countriesJson, historicalJson]
);

export const mockCountriesFetches = (isError: boolean = false) => {
  return jest.spyOn(window, "fetch").mockImplementation((url: any) => {
    switch (url) {
      case COUNTRIES_URL:
        return Promise.resolve({
          json: () => Promise.resolve(countriesJson),
        } as Response);
      case HISTORICAL_URL:
        return isError
          ? Promise.reject({
              json: () => Promise.reject("Something went wrong"),
            } as Response)
          : Promise.resolve({
              json: () => Promise.resolve(historicalJson),
            } as Response);
    }

    throw Error("Uknown fetch request");
  });
};
