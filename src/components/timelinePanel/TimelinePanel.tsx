import { Slider, Typography } from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { memo, useCallback, useMemo } from "react";
import useStyles from "./timleinePanel.styles";

interface TimelinePanelProps {
  date?: Moment;
  onChange: (date: Moment) => void;
  minDate?: Moment;
  maxDate?: Moment;
}

function TimelinePanel({
  date = moment(),
  onChange,
  minDate,
  maxDate,
}: TimelinePanelProps) {
  const classes = useStyles();
  const updateValue = useCallback(
    (e, value) => {
      const newDate = date.clone().dayOfYear(value);
      return onChange(newDate);
    },
    [date, onChange]
  );

  const getMarks = (
    minDate: Moment | undefined,
    maxDate: Moment | undefined
  ) => {
    if (!minDate || !maxDate) return [];

    let dayOfYear: number = maxDate.dayOfYear();
    let marks = [];

    for (let i = dayOfYear; i > minDate.dayOfYear(); i--) {
      const iDate = moment().dayOfYear(i);

      if (iDate.date() === 1) {
        marks.push({
          value: i,
          label: iDate.format("MMMM"),
        });
      }
    }

    return marks;
  };

  const marks = useMemo(
    () => getMarks(minDate, maxDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minDate?.format(), maxDate?.format()]
  );

  return (
    <div className={classes.root}>
      <Typography className={classes.label} data-testid="timeline-label">
        {date.format("LL")}
      </Typography>
      <Slider
        data-testid="timeline-slider"
        aria-labelledby="discrete-slider"
        step={1}
        marks={marks}
        min={minDate?.dayOfYear()}
        max={maxDate?.dayOfYear()}
        value={date.dayOfYear()}
        valueLabelFormat={() => date.format("D")}
        valueLabelDisplay="on"
        onChange={updateValue}
      />
    </div>
  );
}

export default memo(TimelinePanel);
