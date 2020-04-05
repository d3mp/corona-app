import React from "react";
import moment, { Moment } from "moment";
import { useSelector, useDispatch } from "react-redux";
import { HeaderOption } from "./HeaderOption";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { selectSumDataByTimelineDate } from "../countries/countriesSlice";
import {
  selectMomentTimelineDate,
  setTimelineDate,
  FilterType,
  setFilterType,
  selectFilterType,
} from "./sideBarSlice";
import TimelinePanel from "./TimelinePanel";
import { COLORS_BY_FILTER_TYPE } from "../map/mapUtils";

import styles from "./SideBar.module.css";

export function SideBar() {
  const dispatch = useDispatch();
  const date: Moment = useSelector(selectMomentTimelineDate);
  const filterType: FilterType = useSelector(selectFilterType);
  const sumData = useSelector(selectSumDataByTimelineDate);

  return (
    <div className={styles.sideBar}>
      <div className={styles.header}>
        <HeaderOption
          label="Confirmed"
          quantity={sumData.cases}
          activeColor={COLORS_BY_FILTER_TYPE[filterType]}
          isActive={filterType === "cases"}
          onClick={() => dispatch(setFilterType("cases"))}
        />
        <HeaderOption
          label="Recovered"
          quantity={sumData.recovered}
          activeColor={COLORS_BY_FILTER_TYPE[filterType]}
          isActive={filterType === "recovered"}
          onClick={() => dispatch(setFilterType("recovered"))}
        />
        <HeaderOption
          label="Deaths"
          quantity={sumData.deaths}
          activeColor={COLORS_BY_FILTER_TYPE[filterType]}
          isActive={filterType === "deaths"}
          onClick={() => dispatch(setFilterType("deaths"))}
        />
        <HeaderOption
          label="Active"
          quantity={sumData.active}
          activeColor={COLORS_BY_FILTER_TYPE[filterType]}
          isActive={filterType === "active"}
          onClick={() => dispatch(setFilterType("active"))}
        />
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
