import { Nullable, HashMap } from "../../genericTypes";

export enum Status {
  Active = "active",
  Comfirmed = "confirmed",
  Deaths = "deaths",
  Recovered = "recovered",
}

export interface Country {
  country: string;
  province: Nullable<string>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timeline: Timeline;
  updated?: Date;
}

export type CountriesByName = HashMap<Country>;
export type TimelineDates = HashMap<number>;

export interface Timeline {
  [Status.Active]: TimelineDates;
  [Status.Comfirmed]: TimelineDates;
  [Status.Deaths]: TimelineDates;
  [Status.Recovered]: TimelineDates;
}

export interface Timeline {
  [Status.Active]: HashMap<number>;
  [Status.Comfirmed]: HashMap<number>;
  [Status.Deaths]: HashMap<number>;
  [Status.Recovered]: HashMap<number>;
}

export interface TotalByCountry {
  active: number;
  confirmed: number;
  deaths: number;
  recovered: number;
}
