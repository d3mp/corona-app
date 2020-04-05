import { Country, CountryTimeline } from "../features/countries/countriesTypes";

export async function getCountries(): Promise<Country[]> {
  const response = await fetch("http://localhost:30001/countries?sort=country");
  const data: Country[] = await response.json();

  return data;
}

export async function getCountriesTimeline(): Promise<CountryTimeline[]> {
  const response = await fetch(
    "http://localhost:30001/v2/historical?lastdays=all"
  );
  const data: CountryTimeline[] = await response.json();

  return data;
}
