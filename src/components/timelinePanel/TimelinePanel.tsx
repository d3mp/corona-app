import { Box, Hidden, IconButton, Slider, Typography } from "@material-ui/core";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
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

  const handlePrevButton = useCallback(() => {
    const newDate = date.clone().subtract(1, "day");

    if (newDate.isSameOrAfter(minDate)) {
      return onChange(newDate);
    }
  }, [date, minDate, onChange]);

  const handleNextButton = useCallback(() => {
    const newDate = date.clone().add(1, "day");

    if (newDate.isSameOrBefore(maxDate)) {
      return onChange(newDate);
    }
  }, [date, maxDate, onChange]);

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
          label: iDate.format("MMM"),
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
      <Box display="flex" flexDirection="row">
        <Hidden mdUp>
          <IconButton
            className={classes.arrowButton}
            aria-label="button day-before"
            onClick={handlePrevButton}
          >
            <ArrowBackIosOutlined />
          </IconButton>
        </Hidden>
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
        <Hidden mdUp>
          <IconButton
            className={classes.arrowButton}
            aria-label="button day-after"
            onClick={handleNextButton}
          >
            <ArrowForwardIosOutlined />
          </IconButton>
        </Hidden>
      </Box>
    </div>
  );
}

export default memo(TimelinePanel);
