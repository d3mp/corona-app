import { Country } from "../countries/countriesTypes";

export interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface HoveredCountry {
  country: Country;
  offsetX: number;
  offsetY: number;
}
