import React from "react";
import moment, { Moment } from "moment";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { HeaderOption } from "./HeaderOption";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { selectSumDataByTimelineDate } from "../countries/countriesSlice";
import {
  selectMomentTimelineDate,
  setTimelineDate,
  setFilterType,
  selectFilterBy,
  selectIsTableVisibleOnMobile,
} from "./sideBarSlice";
import TimelinePanel from "./TimelinePanel";
import { COLORS_BY_FILTER_TYPE } from "../map/mapUtils";
import { Status } from "../countries/countriesTypes";

import styles from "./SideBar.module.css";

export function SideBar() {
  const dispatch = useDispatch();
  const date: Moment = useSelector(selectMomentTimelineDate);
  const filterBy: Status = useSelector(selectFilterBy);
  const sumData = useSelector(selectSumDataByTimelineDate);
  const isTableVisibleOnMobile: boolean = useSelector(
    selectIsTableVisibleOnMobile
  );

  return (
    <div
      className={clsx(styles.sideBar, isTableVisibleOnMobile && styles.open)}
    >
      <div className={styles.header}>
        <HeaderOption
          label="Confirmed"
          quantity={sumData.confirmed}
          activeColor={COLORS_BY_FILTER_TYPE[filterBy]}
          isActive={filterBy === Status.Comfirmed}
          onClick={() => dispatch(setFilterType(Status.Comfirmed))}
        />
        <HeaderOption
          label="Recovered"
          quantity={sumData.recovered}
          activeColor={COLORS_BY_FILTER_TYPE[filterBy]}
          isActive={filterBy === Status.Recovered}
          onClick={() => dispatch(setFilterType(Status.Recovered))}
        />
        <HeaderOption
          label="Deaths"
          quantity={sumData.deaths}
          activeColor={COLORS_BY_FILTER_TYPE[filterBy]}
          isActive={filterBy === Status.Deaths}
          onClick={() => dispatch(setFilterType(Status.Deaths))}
        />
        <HeaderOption
          label="Active"
          quantity={sumData.active}
          activeColor={COLORS_BY_FILTER_TYPE[filterBy]}
          isActive={filterBy === Status.Active}
          onClick={() => dispatch(setFilterType(Status.Active))}
        />
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