import { Box, Hidden, IconButton, Slider, Typography } from "@material-ui/core";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@material-ui/icons";
import moment, { Moment } from "moment";
import React, { memo, useCallback, useMemo } from "react";
import { getMarks } from "./timelinePanelUtils";
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

  const marks = useMemo(
    () => getMarks(minDate, maxDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minDate?.format(), maxDate?.format()]
  );

  const updateValue = useCallback(
    (e, value) => {
      const newDate = moment(value);
      return onChange(newDate);
    },
    [onChange]
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
          min={minDate?.valueOf()}
          max={maxDate?.valueOf()}
          value={date?.valueOf()}
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
