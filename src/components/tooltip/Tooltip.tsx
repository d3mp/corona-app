import { makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import { Moment } from "moment";
import React from "react";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { Status } from "../../features/countries/countriesTypes";
import { HoveredCountry } from "../../features/map/mapTypes";
import { Nullable } from "../../genericTypes";
import TooltipRow from "./TooltipRow";

const useStyles = makeStyles((theme: Theme) => ({
  tooltip: {
    position: "absolute",
    maxWidth: 400,
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    borderColor: theme.palette.divider,
    pointerEvents: "none",
  },
  country: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

type Props = {
  date: Moment;
  hoveredCountry?: Nullable<HoveredCountry>;
};

const Tooltip = ({ date, hoveredCountry }: Props) => {
  const classes = useStyles();

  if (hoveredCountry) {
    const currentDate: string = date.format(SHORT_DATE_FORMAT);
    const prevDate: string = date
      .clone()
      .subtract(1, "day")
      .format(SHORT_DATE_FORMAT);
    const timeline = hoveredCountry.country.timeline;
    const tooltipRows = [
      { label: "Confirmed", status: Status.Confirmed },
      { label: "Recovered", status: Status.Recovered },
      { label: "Deaths", status: Status.Deaths },
      { label: "Active", status: Status.Active },
    ];

    return (
      <Paper
        className={classes.tooltip}
        style={{
          position: "absolute",
          top: hoveredCountry.offsetY,
          left: hoveredCountry.offsetX,
        }}
      >
        <Typography className={classes.country} data-testid="tooltip-country">
          {hoveredCountry.country.country}
        </Typography>
        {tooltipRows.map(({ label, status }) => (
          <TooltipRow
            key={status}
            label={label}
            value={timeline[status][currentDate]}
            perDay={timeline[status][currentDate] - timeline[status][prevDate]}
            status={status}
          />
        ))}
      </Paper>
    );
  }

  return null;
};

export default Tooltip;
