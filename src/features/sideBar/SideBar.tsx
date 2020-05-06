import clsx from "clsx";
import moment, { Moment } from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/searchBar/SearchBar";
import TimelinePanel from "../../components/timelinePanel/TimelinePanel";
import { TotalCount } from "../../components/totalCount/TotalCount";
import {
  selectFilteredStartTimelineDate,
  selectFilteredSumData,
} from "../countries/countriesSlice";
import { Status } from "../countries/countriesTypes";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { COLORS_BY_FILTER_TYPE } from "../map/mapUtils";
import styles from "./SideBar.module.scss";
import {
  selectFilterBy,
  selectIsTableVisibleOnMobile,
  selectMomentTimelineDate,
  setFilterBy,
  setSearchValue,
  setTimelineDate,
} from "./sideBarSlice";
import { FilterBy } from "./sideBarTypes";

function SideBar() {
  const dispatch = useDispatch();
  const date: Moment = useSelector(selectMomentTimelineDate);
  const startDate: Moment = useSelector(selectFilteredStartTimelineDate);
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const sumData = useSelector(selectFilteredSumData);
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
          <TotalCount
            key={status}
            label={label}
            quantity={sumData[status]}
            activeColor={COLORS_BY_FILTER_TYPE[filterBy.status]}
            isActive={filterBy.status === status}
            onClick={() =>
              dispatch(setFilterBy({ status, favorite: filterBy.favorite }))
            }
          />
        ))}
      </div>
      <TimelinePanel
        date={moment(date)}
        onChange={(date) => dispatch(setTimelineDate(date.format()))}
        minDate={startDate}
        maxDate={moment()}
      />
      <SearchBar
        onChange={(searchValue: string) =>
          dispatch(setSearchValue(searchValue))
        }
      />
      <CountriesTable />
    </div>
  );
}

export { SideBar };
