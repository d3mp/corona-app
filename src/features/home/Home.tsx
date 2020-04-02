import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AutoSizer,
  Column,
  Table,
  SortIndicator,
  TableHeaderProps,
  SortDirectionType,
} from "react-virtualized";
import "react-virtualized/styles.css";
import {
  fetchCountries,
  fetchCountriesTimeline,
  selectSortBy,
  selectSortDirection,
  sort,
  selectSortedData,
} from "./homeSlice";

import styles from "./Home.module.css";

export function Home() {
  const dispatch = useDispatch();
  const data: any[] = useSelector(selectSortedData);
  const sortBy: string = useSelector(selectSortBy);
  const sortDirection: SortDirectionType = useSelector(selectSortDirection);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchCountriesTimeline());
  }, [dispatch]);

  return (
    <div>
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            width={width}
            height={200}
            headerHeight={40}
            rowHeight={40}
            rowCount={data.length}
            rowClassName={rowClassName}
            rowGetter={({ index }) => data[index]}
            sort={({ sortBy, sortDirection }) =>
              dispatch(sort({ sortBy, sortDirection }))
            }
            sortBy={sortBy}
            sortDirection={sortDirection}
          >
            <Column
              label="#"
              dataKey="index"
              disableSort
              width={50}
              headerRenderer={headerRenderer}
            />
            <Column
              label="Country"
              dataKey="country"
              width={width / 4}
              headerRenderer={headerRenderer}
            />
            <Column
              label="Actiive cases"
              dataKey="casesWithoutDeaths"
              width={width / 4}
              headerRenderer={headerRenderer}
            />
            <Column
              label="Recovered"
              dataKey="recovered"
              width={width / 4}
              headerRenderer={headerRenderer}
            />
            <Column
              label="Recovered %"
              dataKey="recoveredPercentage"
              width={width / 4}
              headerRenderer={headerRenderer}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
}

function headerRenderer({
  dataKey,
  label,
  sortBy,
  sortDirection,
  ...rest
}: TableHeaderProps): React.ReactNode {
  return (
    <div key={dataKey}>
      <span>{label}</span>
      <span>
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </span>
    </div>
  );
}

function rowClassName({ index }: { index: number }): string {
  if (index >= 0) {
    return index % 2 ? styles["even-row"] : styles["odd-row"];
  }

  return styles["header-row"];
}
