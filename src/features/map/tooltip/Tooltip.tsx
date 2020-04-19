import { Moment } from "moment";
import React from "react";
import { SHORT_DATE_FORMAT } from "../../../common/constants/global";
import { Status } from "../../countries/countriesTypes";
import { HoveredCountry } from "../mapTypes";
import styles from "./Tooltip.module.css";
import { TooltipRow } from "./TooltipRow";

interface TooltipProps {
  date: Moment;
  hoveredCountry: HoveredCountry;
}

function Tooltip({ date, hoveredCountry }: TooltipProps) {
  if (hoveredCountry.country) {
    const currentDate: string = date.format(SHORT_DATE_FORMAT);
    const prevDate: string = date
      .clone()
      .subtract(1, "day")
      .format(SHORT_DATE_FORMAT);
    const timeline = hoveredCountry.country.timeline;
    const tooltipRows = [
      { label: "Confirmed", status: Status.Confirmed },
      { label: "Deaths", status: Status.Deaths },
      { label: "Recovered", status: Status.Recovered },
      { label: "Active", status: Status.Active },
    ];

    return (
      <div
        className={styles.tooltip}
        style={{
          top: hoveredCountry.offsetY,
          left: hoveredCountry.offsetX,
        }}
      >
        <b>{hoveredCountry.country.country}</b>
        {tooltipRows.map(({ label, status }) => (
          <TooltipRow
            key={status}
            label={label}
            value={timeline[status][currentDate]}
            perDay={timeline[status][currentDate] - timeline[status][prevDate]}
            status={status}
          />
        ))}
      </div>
    );
  }

  return null;
}

export { Tooltip };
