import { CountriesByName } from "../features/countries/countriesTypes";
import { mergeCountriesWithHistoricalData } from "../features/countries/countriesUtils";

export const API_URL = "https://corona.lmao.ninja";
export const COUNTRIES_URL = `${API_URL}/v2/countries`;
export const HISTORICAL_URL = `${API_URL}/v2/historical?lastdays=all`;

export async function getCountries(): Promise<CountriesByName> {
  const urls: string[] = [COUNTRIES_URL, HISTORICAL_URL];
  const response: any[] = await Promise.all(
    urls.map(async (url: string) => {
      const response = await fetch(url);
      return response.json();
    })
  );

  return mergeCountriesWithHistoricalData(response);
}
