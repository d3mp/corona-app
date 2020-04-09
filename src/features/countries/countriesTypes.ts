export enum Status {
  Active = "active",
  Comfirmed = "confirmed",
  Deaths = "deaths",
  Recovered = "recovered",
}

export interface Country {
  country: string;
  province: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timeline: Timeline;
  updated?: Date;
}

export type Province = Country;
export interface TimelineDates {
  [date: string]: number;
}
export interface Timeline {
  [Status.Active]: TimelineDates;
  [Status.Comfirmed]: TimelineDates;
  [Status.Deaths]: TimelineDates;
  [Status.Recovered]: TimelineDates;
}

export interface CountriesByName {
  [countryName: string]: Country;
}

export interface TotalByCountry {
  active: number;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CountryTimeline {
  country: string;
  province: string | null;
  timeline: {
    cases: {
      [date: string]: number;
    };
    deaths: {
      [date: string]: number;
    };
    recovered: {
      [date: string]: number;
    };
  };
}
