import moment, { Moment } from "moment";

const dayInMilliseconds = 86400000;

export const getMarks = (
  minDate: Moment | undefined,
  maxDate: Moment | undefined
) => {
  if (!minDate || !maxDate) return [];

  let marks = [];
  let maxDateTimestamp: number = maxDate.valueOf();
  let minDateTimestamp: number = minDate.valueOf();

  for (let i = maxDateTimestamp; i > minDateTimestamp; i -= dayInMilliseconds) {
    const iDate = moment(i);

    if (iDate.date() === 1) {
      marks.push({
        value: i,
        label: iDate.format("MMM"),
      });
    }
  }

  return marks;
};
