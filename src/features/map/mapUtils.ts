import { FilterType } from "../sideBar/sideBarSlice";

export const COLORS_BY_FILTER_TYPE = {
  cases: "#FF5733",
  recovered: "#75FF33",
  deaths: "#BD33FF",
  active: "#FFBD33",
};

/**
 * Creates an array with input/output paris for interpolate expression
 * @param max
 */
export function getInOurPais(max: number = 1000000) {
  const steps = [0, 1, 5, 10, 50, 100, 500, 1000, 2000];
  let step = 5000;

  while (step <= max) {
    steps.push(step);

    if (step < 100000) {
      step += 5000;
    } else if (step < 200000) {
      step += 10000;
    } else {
      step += 20000;
    }
  }

  return steps.reduce((steps: number[], step: number, index) => {
    return [...steps, step, index + 2 * 2];
  }, []);
}

/**
 * Creates specific expression for getting timeline information from  feature property
 * @param operator
 * @param date
 * @param filterType
 */
export function getTimelineExpression(
  operator: mapboxgl.ExpressionName = "get",
  date: string,
  field: FilterType
): mapboxgl.Expression {
  // return [operator, date, ["get", field, ["get", "timeline"]]];
  return [operator, field];
}
