import { Country, CountryTimeline } from "../features/home/homeTypes";

export async function getCountries(): Promise<Country[]> {
  const response = await fetch(
    "https://corona.lmao.ninja/countries?sort=country"
  );
  const data: Country[] = await response.json();

  return data;
}

export async function getCountriesTimeline(): Promise<CountryTimeline[]> {
  const response = await fetch("https://corona.lmao.ninja/v2/historical");
  const data: CountryTimeline[] = await response.json();

  return data;
}
