import React from "react";
import { Status } from "../../countries/countriesTypes";
import { COLORS_BY_FILTER_TYPE } from "../mapUtils";

interface RowProps {
  label: string;
  value: number;
  perDay: number;
  status: Status;
}

function Row({ label, value, perDay, status }: RowProps) {
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

export { Row };
