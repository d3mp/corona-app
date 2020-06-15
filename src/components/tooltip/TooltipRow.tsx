import { makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Status } from "../../features/countries/countriesTypes";
import { COLORS_BY_FILTER_TYPE } from "../../features/map/mapUtils";

const useStyles = makeStyles((theme: Theme) => ({
  tooltipRow: {
    display: "flex",
  },
  label: {
    flex: 1,
    paddingTop: theme.spacing(0.3),
    whiteSpace: "nowrap",

    "&:last-child": {
      paddingLeft: theme.spacing(1),
      textAlign: "right",
    },
  },
  quantityChange: {
    paddingLeft: theme.spacing(0.1),
    verticalAlign: "top",
  },
}));

interface TooltipRowProps {
  label: string;
  value: number;
  perDay: number;
  status: Status;
}

const TooltipRow = ({ label, value, perDay, status }: TooltipRowProps) => {
  const classes = useStyles();

  return (
    <div className={classes.tooltipRow}>
      <Typography
        className={classes.label}
        variant="body2"
        component="span"
        data-testid="tooltip-label"
      >
        {label}:
      </Typography>
      <Typography
        className={classes.label}
        align="right"
        variant="body2"
        component="span"
        style={{ color: COLORS_BY_FILTER_TYPE[status] }}
        data-testid="tooltip-value"
      >
        {value?.toLocaleString() || 0}
        <Typography
          className={classes.quantityChange}
          variant="caption"
          component="sup"
          data-testid="difference"
        >
          {`(${perDay > 0 ? "+" : ""}${
            (!isNaN(perDay) && perDay?.toLocaleString()) || 0
          })`}
        </Typography>
      </Typography>
    </div>
  );
};

export default TooltipRow;
