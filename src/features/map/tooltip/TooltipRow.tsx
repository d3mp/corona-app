import React from "react";
import { Status } from "../../countries/countriesTypes";
import { COLORS_BY_FILTER_TYPE } from "../mapUtils";

interface TooltipRowProps {
  label: string;
  value: number;
  perDay: number;
  status: Status;
}

function TooltipRow({ label, value, perDay, status }: TooltipRowProps) {
  return (
    <div>
      <span>{label}:</span>
      <span style={{ color: COLORS_BY_FILTER_TYPE[status] }}>
        <span>{value?.toLocaleString() || 0}</span>
        <sup>
          (
          {`${perDay > 0 ? "+" : ""}${
            (!isNaN(perDay) && perDay?.toLocaleString()) || 0
          }`}
          )
        </sup>
      </span>
    </div>
  );
}

export { TooltipRow };
