import moment from "moment";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import {
  CountriesByName,
  Country,
  Status,
  Timeline,
  TimelineDates,
} from "./countriesTypes";

const defaultTimeline: Timeline = {
  [Status.Active]: {},
  [Status.Confirmed]: {},
  [Status.Deaths]: {},
  [Status.Recovered]: {},
};

/**
 * Returns an array of merged countries with timelines
 * @param response
 */
export function mergeCountriesWithHistoricalData(
  response: any[]
): CountriesByName {
  const countriesByName: CountriesByName = getCountriesByHistoricalName(
    response[0]
  );
  const historicalCountriesWithProvincesByName: CountriesByName = getHistoricalCountriesWithProvincesByGlobalName(
    response[1],
    countriesByName
  );

  return Object.values(countriesByName).reduce(
    (countries: CountriesByName, country: Country) => {
      const historicalCountry =
        historicalCountriesWithProvincesByName[country.country];
      const timeline: Timeline = historicalCountry
        ? historicalCountry.timeline
        : defaultTimeline;

      if (!Object.keys(timeline[Status.Confirmed]).length) {
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
            [Status.Confirmed]: {
              ...timeline[Status.Confirmed],
              ...country.timeline[Status.Confirmed],
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
  return response.reduce((countriesByName: CountriesByName, value: any) => {
    const date = moment.utc(value.updated).format(SHORT_DATE_FORMAT);
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
        [Status.Confirmed]: {
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
    const country: Country = {
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
        [Status.Confirmed]: curr.timeline.cases,
        [Status.Deaths]: curr.timeline.deaths,
        [Status.Recovered]: curr.timeline.recovered,
      },
    };
    const shouldSummarizeProvinces: boolean = [
      "Australia",
      "China",
      "Canada",
    ].includes(country.country);

    if (!prev[country.country]) {
      if (!country.province || shouldSummarizeProvinces) {
        prev[country.country] = {
          ...country,
          province: null,
          timeline: country.province ? defaultTimeline : country.timeline,
        };
      }
    }

    if (country.province) {
      prev[country.province] = country;
    }

    if (prev[country.country] && country.province) {
      if (shouldSummarizeProvinces) {
        prev[country.country].timeline = sumTimelines(
          prev[country.country].timeline,
          country.timeline
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
