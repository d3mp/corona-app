export function getSteps(max: number = 1000000) {
  const steps = [0, 1, 5, 10, 50, 100, 500, 1000, 2000];

  for (let step = 5000; step <= max; step += 5000) {
    steps.push(step);

    if (step >= 100000) {
      step += 5000;
    }

    if (step >= 200000) {
      step += 15000;
    }
  }

  return steps.reduce((steps: number[], step: number, index) => {
    return [...steps, step, index + 2 * 2];
  }, []);
}
