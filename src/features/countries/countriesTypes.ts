export interface Country {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
    population: number | null;
  };
  active: number;
  cases: number;
  critical: number;
  deaths: number;
  todayCases: number;
  todayDeaths: number;
  recovered: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  updated: Date;
  timeline: Pick<CountryTimeline, "timeline">;
}

export interface TotalByCountry {
  active: number;
  cases: number;
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

export interface CountriesByName {
  [countryName: string]: Country;
}

export interface CountriesTimelineByName {
  [countryName: string]: CountryTimeline;
}
