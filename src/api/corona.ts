import { Country, CountryTimeline } from "../features/countries/countriesTypes";

export async function getCountries(): Promise<Country[]> {
  const response = await fetch(
    "https://corona.lmao.ninja/countries?sort=countr"
  );
  const data: Country[] = await response.json();

  return data;
}

export async function getCountriesTimeline(): Promise<CountryTimeline[]> {
  const response = await fetch(
    "https://corona.lmao.ninja/v2/historical?lastdays=all"
  );
  const data: CountryTimeline[] = await response.json();

  return data;
}
