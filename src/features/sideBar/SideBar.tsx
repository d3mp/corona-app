import moment, { Moment } from "moment";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HeaderOption } from "./HeaderOption";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { selectSumDataByTimelineDate } from "../countries/countriesSlice";
import { selectMomentTimelineDate, setTimelineDate } from "./sideBarSlice";
import TimelinePanel from "./TimelinePanel";

import styles from "./SideBar.module.css";

export function SideBar() {
  const dispatch = useDispatch();
  const date: Moment = useSelector(selectMomentTimelineDate);
  const sumData = useSelector(selectSumDataByTimelineDate);

  return (
    <div className={styles.sideBar}>
      <div className={styles.header}>
        <HeaderOption label="Confirmed" quantity={sumData.cases} />
        <HeaderOption label="Recovered" quantity={sumData.recovered} />
        <HeaderOption label="Deaths" quantity={sumData.recovered} />
        <HeaderOption label="Active" quantity={sumData.active} />
      </div>
      <div className={styles.body}>
        <TimelinePanel
          date={moment(date)}
          onChange={(date) => dispatch(setTimelineDate(date.format()))}
          minDate={moment("2020-01-22T00:00:00")}
          maxDate={moment()}
        />
        <CountriesTable />
      </div>
    </div>
  );
}
