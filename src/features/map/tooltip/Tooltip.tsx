import { Moment } from "moment";
import React from "react";
import { SHORT_DATE_FORMAT } from "../../../common/constants/global";
import { Status } from "../../countries/countriesTypes";
import { HoveredCountry } from "../mapTypes";
import { Row } from "./Row";
import styles from "./Tooltip.module.css";

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

    return (
      <div
        className={styles.tooltip}
        style={{
          top: hoveredCountry.offsetY,
          left: hoveredCountry.offsetX,
        }}
      >
        <b>{hoveredCountry.country.country}</b>
        <Row
          label="Confirmed"
          value={timeline[Status.Confirmed][currentDate]}
          perDay={
            timeline[Status.Confirmed][currentDate] -
            timeline[Status.Confirmed][prevDate]
          }
          status={Status.Confirmed}
        />
        <Row
          label="Death"
          value={timeline[Status.Deaths][currentDate]}
          perDay={
            timeline[Status.Deaths][currentDate] -
            timeline[Status.Deaths][prevDate]
          }
          status={Status.Deaths}
        />
        <Row
          label="Recovered"
          value={timeline[Status.Recovered][currentDate]}
          perDay={
            timeline[Status.Recovered][currentDate] -
            timeline[Status.Recovered][prevDate]
          }
          status={Status.Recovered}
        />
        <Row
          label="Active"
          value={timeline[Status.Active][currentDate]}
          perDay={
            timeline[Status.Active][currentDate] -
            timeline[Status.Active][prevDate]
          }
          status={Status.Active}
        />
      </div>
    );
  }

  return null;
}

export { Tooltip };
