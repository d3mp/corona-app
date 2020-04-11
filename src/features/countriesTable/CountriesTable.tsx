import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer, Table, Column, SortDirectionType } from "react-virtualized";
import clsx from "clsx";
import { selectSortedCountriesByTimelineDate } from "../countries/countriesSlice";
import {
  selectSortBy,
  selectSortDirection,
  sort,
  selectMomentTimelineDate,
  selectIsTableVisibleOnMobile,
  toggleTableVisibility,
} from "../sideBar/sideBarSlice";
import { headerRenderer } from "./CountriesTableHeader";
import { Country, Status } from "../countries/countriesTypes";
import { setViewport } from "../map/mapSlice";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";

import styles from "./CountriesTable.module.css";

export function CountriesTable() {
  const dispatch = useDispatch();
  const countries: Country[] = useSelector(selectSortedCountriesByTimelineDate);
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const sortBy: string = useSelector(selectSortBy);
  const sortDirection: SortDirectionType = useSelector(selectSortDirection);
  const isTableVisibleOnMobile: boolean = useSelector(
    selectIsTableVisibleOnMobile
  );

  return (
    <div style={{ height: "100%" }}>
      <div
        className={clsx(
          styles.tableContainer,
          !isTableVisibleOnMobile && styles.hiddenForMobile
        )}
      >
        <AutoSizer>
          {({ width, height }) => {
            const indexWidth: number = 50;
            const colWidth = ((width - indexWidth) / 100) * 17.5;
            const countryWidth = ((width - indexWidth) / 100) * 30;

            return (
              <Table
                width={width}
                height={height}
                headerHeight={40}
                rowHeight={50}
                rowCount={countries.length}
                rowClassName={rowClassName}
                rowGetter={({ index }) => countries[index]}
                onRowClick={({ rowData }: { rowData: Country }) =>
                  dispatch(
                    setViewport({
                      longitude: rowData.coordinates.longitude,
                      latitude: rowData.coordinates.latitude,
                      zoom: 6,
                    })
                  )
                }
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
                  width={indexWidth}
                  headerRenderer={headerRenderer}
                />
                <Column
                  width={countryWidth}
                  label="Country"
                  dataKey="country"
                  defaultSortDirection="ASC"
                  headerRenderer={headerRenderer}
                />
                <Column
                  label="Confirmed"
                  dataKey={Status.Comfirmed}
                  defaultSortDirection="DESC"
                  width={colWidth}
                  headerRenderer={headerRenderer}
                  cellDataGetter={({ dataKey, rowData }) =>
                    rowData.timeline[dataKey][date]?.toLocaleString() || 0
                  }
                />
                <Column
                  label="Recovered"
                  dataKey={Status.Recovered}
                  defaultSortDirection="DESC"
                  width={colWidth}
                  headerRenderer={headerRenderer}
                  cellDataGetter={({ dataKey, rowData }) =>
                    rowData.timeline[dataKey][date]?.toLocaleString() || 0
                  }
                />
                <Column
                  label="Deaths"
                  dataKey={Status.Deaths}
                  defaultSortDirection="DESC"
                  width={colWidth}
                  headerRenderer={headerRenderer}
                  cellDataGetter={({ dataKey, rowData }) =>
                    rowData.timeline[dataKey][date]?.toLocaleString() || 0
                  }
                />
                <Column
                  label="Active"
                  dataKey={Status.Active}
                  defaultSortDirection="DESC"
                  width={colWidth}
                  headerRenderer={headerRenderer}
                  cellDataGetter={({ dataKey, rowData }) =>
                    rowData.timeline[dataKey][date]?.toLocaleString() || 0
                  }
                />
              </Table>
            );
          }}
        </AutoSizer>
      </div>
      <div
        className={styles.toggleTable}
        onClick={() => dispatch(toggleTableVisibility())}
      >
        {`${isTableVisibleOnMobile ? "Hide" : "Show"} table`}
      </div>
    </div>
  );
}

function rowClassName({ index }: { index: number }): string {
  if (index >= 0) {
    return index % 2 ? styles.evenRow : styles.oddRow;
  }

  return styles.headerRow;
}
