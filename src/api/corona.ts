import {
  Country,
  Status,
  Province,
  Timeline,
  CountriesByName,
  TimelineDates,
} from "../features/countries/countriesTypes";
import moment from "moment";
import { SHORT_DATE_FORMAT } from "../common/constants/global";

const defaultTimeline: Timeline = {
  [Status.Active]: {},
  [Status.Comfirmed]: {},
  [Status.Deaths]: {},
  [Status.Recovered]: {},
};

export async function getCountries(): Promise<CountriesByName> {
  const urls: string[] = [
    "https://corona.lmao.ninja/countries",
    "https://corona.lmao.ninja/v2/historical?lastdays=all",
  ];
  const response = await Promise.all(
    urls.map(async (url: string) => {
      const response = await fetch(url);
      return response.json();
    })
  );

  const countriesByName: CountriesByName = getCountriesByHistoricalName(
    response[0]
  );
  const historicalCountriesWithProvincesByName: CountriesByName = getHistoricalCountriesWithProvincesByGlobalName(
    response[1],
    countriesByName
  );
  // Merge historical and current data
  return Object.values(countriesByName).reduce(
    (countries: CountriesByName, country: Country) => {
      const historicalCountry =
        historicalCountriesWithProvincesByName[country.country];
      const timeline: Timeline = historicalCountry
        ? historicalCountry.timeline
        : defaultTimeline;

      if (!Object.keys(timeline[Status.Comfirmed]).length) {
        console.warn("countries without timeline", country);
      }

      return {
        ...countries,
        [country.country]: {
          ...country,
          timeline: removeEmptyDays({
            [Status.Active]: {
              ...timeline[Status.Active],
              ...country.timeline[Status.Active],
            },
            [Status.Comfirmed]: {
              ...timeline[Status.Comfirmed],
              ...country.timeline[Status.Comfirmed],
            },
            [Status.Deaths]: {
              ...timeline[Status.Deaths],
              ...country.timeline[Status.Deaths],
            },
            [Status.Recovered]: {
              ...timeline[Status.Recovered],
              ...country.timeline[Status.Recovered],
            },
          }),
        },
      };
    },
    {}
  );
}

/**
 * Returns map of countrise by historical name
 * @param response
 */
function getCountriesByHistoricalName(response: []): CountriesByName {
  const date = moment.utc().format(SHORT_DATE_FORMAT);

  return response.reduce((countriesByName: CountriesByName, value: any) => {
    const country: Country = {
      country: value.country,
      province: null,
      coordinates: {
        latitude: value.countryInfo.lat,
        longitude: value.countryInfo.long,
      },
      timeline: {
        [Status.Active]: {
          [date]: value.cases - value.deaths - value.recovered,
        },
        [Status.Comfirmed]: {
          [date]: value.cases,
        },
        [Status.Deaths]: {
          [date]: value.deaths,
        },
        [Status.Recovered]: {
          [date]: value.recovered,
        },
      },
      updated: value.updated,
    };

    return {
      ...countriesByName,
      [convertGlobalNameToHistorical(country.country)]: country,
    };
  }, {});
}

/**
 * Returns map of historical countries and provinces by global name
 * @param response
 * @param countriesByName
 */
function getHistoricalCountriesWithProvincesByGlobalName(
  response: [],
  countriesByName: CountriesByName
): CountriesByName {
  return response.reduce((prev: CountriesByName, curr: any) => {
    const maybeProvince: Country | Province = {
      country:
        countriesByName[curr.country]?.country ||
        convertHistoricalNameToGlobal(curr.country),
      province:
        countriesByName[curr.province]?.country ||
        convertHistoricalNameToGlobal(curr.province),
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
      timeline: {
        [Status.Active]: Object.keys(curr.timeline.cases).reduce(
          (prevDates: TimelineDates, date: string) => {
            const active: number =
              curr.timeline.cases[date] -
              curr.timeline.deaths[date] -
              curr.timeline.recovered[date];

            prevDates[date] = active;

            return prevDates;
          },
          {}
        ),
        [Status.Comfirmed]: curr.timeline.cases,
        [Status.Deaths]: curr.timeline.deaths,
        [Status.Recovered]: curr.timeline.recovered,
      },
    };
    const shouldSummarizeProvinces: boolean = [
      "Australia",
      "China",
      "Canada",
    ].includes(maybeProvince.country);

    if (!prev[maybeProvince.country]) {
      if (!maybeProvince.province || shouldSummarizeProvinces) {
        prev[maybeProvince.country] = {
          ...maybeProvince,
          province: null,
          timeline: maybeProvince.province
            ? defaultTimeline
            : maybeProvince.timeline,
        };
      }
    }

    if (maybeProvince.province) {
      prev[maybeProvince.province] = maybeProvince;
    }

    if (prev[maybeProvince.country] && maybeProvince.province) {
      if (shouldSummarizeProvinces) {
        prev[maybeProvince.country].timeline = sumTimelines(
          prev[maybeProvince.country].timeline,
          maybeProvince.timeline
        );
      }
    }

    return prev;
  }, {});
}

/**
 * Returns Timeline without empty days to optimize store size
 * @param timeline
 */
function removeEmptyDays(timeline: Timeline): Timeline {
  const statuses = Object.keys(timeline) as Status[];

  return statuses.reduce((statuses: Timeline, status: Status) => {
    return {
      ...statuses,
      [status]: Object.keys(timeline[status]).reduce(
        (dates: TimelineDates, date: string) => {
          if (timeline[status][date]) {
            dates[date] = timeline[status][date];
          }

          return dates;
        },
        {}
      ),
    };
  }, defaultTimeline);
}

/**
 * Returns summarized timelines
 * @param timeline1
 * @param timeline2
 */
function sumTimelines(timeline1: Timeline, timeline2: Timeline) {
  const statuses = Object.keys(timeline1) as Status[];

  return statuses.reduce((timeline: Timeline, status: Status) => {
    const timelineDates1 = Object.keys(timeline1[status]);
    const timelineDates2 = Object.keys(timeline2[status]);
    const dates = timelineDates1.length ? timelineDates1 : timelineDates2;

    return {
      ...timeline,
      [status]: dates.reduce((dates, date: string) => {
        return {
          ...dates,
          [date]:
            (timeline1[status][date] || 0) + (timeline2[status][date] || 0),
        };
      }, {}),
    };
  }, defaultTimeline);
}

const globalToHistoricalNames: { [name: string]: string } = {
  "Côte d'Ivoire": "Cote d'Ivoire",
  Palestine: "West Bank and Gaza",
  "Lao People's Democratic Republic": 'Lao People"s Democratic Republic',
  Myanmar: "Burma",
  "Holy See (Vatican City State)": "Holy See",
  Réunion: "Reunion",
  Macao: "macau",
  "Saint Martin": "st martin",
  "St. Barth": "saint barthelemy",
  "Saint Pierre Miquelon": "saint pierre and miquelon",
  Curaçao: "curacao",
  "Caribbean Netherlands": "bonaire, sint eustatius and saba",
};

function convertGlobalNameToHistorical(name: string) {
  return (globalToHistoricalNames[name] || name).toLowerCase();
}

function convertHistoricalNameToGlobal(name: string) {
  const historicalToGlobalNames: {
    [name: string]: string;
  } = Object.keys(globalToHistoricalNames).reduce(
    (prev, key) => ({ ...prev, [globalToHistoricalNames[key]]: key }),
    {}
  );

  return historicalToGlobalNames[name] || name;
}
