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
  timeline: HistoricalTimeline;
}

export interface TotalByCountry {
  active: number;
  cases: number;
  critical: number;
  deaths: number;
  todayCases: number;
  todayDeaths: number;
  recovered: number;
}

export interface HistoricalTimeline {
  cases: {
    [date: string]: number;
  };
  deaths: {
    [date: string]: number;
  };
  recovered: {
    [date: string]: number;
  };
}

export interface HistoricalData {
  country: string;
  province: string | null;
  timeline: HistoricalTimeline;
}
