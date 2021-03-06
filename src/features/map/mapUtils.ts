import { Status } from "../countries/countriesTypes";

export const COLORS_BY_FILTER_TYPE = {
  [Status.Confirmed]: "#FF5733",
  [Status.Recovered]: "#6EB277",
  [Status.Deaths]: "#BD33FF",
  [Status.Active]: "#FF8A33",
};

/**
 * Creates an array with input/output paris for interpolate expression
 * @param max
 */
export function getInOurPais(max: number = 50000000) {
  const steps = [0, 1, 5, 10, 50, 100, 500, 1000, 2000];
  let step = 5000;

  while (step <= max) {
    steps.push(step);

    if (step < 100000) {
      step += 10000;
    } else if (step < 1000000) {
      step += 50000;
    } else if (step < 10000000) {
      step += 500000;
    } else {
      step += 1000000;
    }
  }

  return steps.reduce((steps: number[], step: number, index) => {
    return [...steps, step, index + 2 * 2];
  }, []);
}

/**
 * Creates specific expression for getting timeline information from feature property
 * @param operator
 * @param date
 * @param status
 */
export function getTimelineExpression(
  operator: mapboxgl.ExpressionName = "get",
  date: string
): mapboxgl.Expression {
  return [operator, date];
}
