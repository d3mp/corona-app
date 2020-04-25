import React from "react";
import { Status } from "../../features/countries/countriesTypes";
import { COLORS_BY_FILTER_TYPE } from "../../features/map/mapUtils";

interface TooltipRowProps {
  label: string;
  value: number;
  perDay: number;
  status: Status;
}

function TooltipRow({ label, value, perDay, status }: TooltipRowProps) {
  return (
    <div>
      <span data-testid="tooltip-label">{label}:</span>
      <span
        data-testid="tooltip-value"
        style={{ color: COLORS_BY_FILTER_TYPE[status] }}
      >
        {value?.toLocaleString() || 0}
        <sup data-testid="difference">
          {`(${perDay > 0 ? "+" : ""}${
            (!isNaN(perDay) && perDay?.toLocaleString()) || 0
          })`}
        </sup>
      </span>
    </div>
  );
}

export { TooltipRow };
