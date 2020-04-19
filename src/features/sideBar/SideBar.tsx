import clsx from "clsx";
import moment, { Moment } from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSumDataByTimelineDate } from "../countries/countriesSlice";
import { Status } from "../countries/countriesTypes";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { COLORS_BY_FILTER_TYPE } from "../map/mapUtils";
import styles from "./SideBar.module.css";
import {
  selectFilterBy,
  selectIsTableVisibleOnMobile,
  selectMomentTimelineDate,
  setFilterType,
  setTimelineDate,
} from "./sideBarSlice";
import { SideBarTotalCount } from "./SideBarTotalCount";
import TimelinePanel from "./timelinePanel/TimelinePanel";

export function SideBar() {
  const dispatch = useDispatch();
  const date: Moment = useSelector(selectMomentTimelineDate);
  const filterBy: Status = useSelector(selectFilterBy);
  const sumData = useSelector(selectSumDataByTimelineDate);
  const isTableVisibleOnMobile: boolean = useSelector(
    selectIsTableVisibleOnMobile
  );
  const totals = [
    { label: "Confirmed", status: Status.Confirmed },
    { label: "Recovered", status: Status.Recovered },
    { label: "Deaths", status: Status.Deaths },
    { label: "Active", status: Status.Active },
  ];

  return (
    <div
      className={clsx(styles.sideBar, isTableVisibleOnMobile && styles.open)}
    >
      <div className={styles.header}>
        {totals.map(({ label, status }) => (
          <SideBarTotalCount
            key={status}
            label={label}
            quantity={sumData[status]}
            activeColor={COLORS_BY_FILTER_TYPE[filterBy]}
            isActive={filterBy === status}
            onClick={() => dispatch(setFilterType(status))}
          />
        ))}
      </div>
      <TimelinePanel
        date={moment(date)}
        onChange={(date) => dispatch(setTimelineDate(date.format()))}
        minDate={moment("2020-01-22T00:00:00")}
        maxDate={moment()}
      />
      <CountriesTable />
    </div>
  );
}
