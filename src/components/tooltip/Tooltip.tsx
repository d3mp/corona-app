import { Moment } from "moment";
import React from "react";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { Status } from "../../features/countries/countriesTypes";
import { HoveredCountry } from "../../features/map/mapTypes";
import { Nullable } from "../../genericTypes";
import styles from "./Tooltip.module.css";
import { TooltipRow } from "./TooltipRow";

interface TooltipProps {
  date: Moment;
  hoveredCountry?: Nullable<HoveredCountry>;
}

function Tooltip({ date, hoveredCountry }: TooltipProps) {
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
      <div
        className={styles.tooltip}
        style={{
          top: hoveredCountry.offsetY,
          left: hoveredCountry.offsetX,
        }}
      >
        <b data-testid="tooltip-country">{hoveredCountry.country.country}</b>
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
