import { Star, StarBorder } from "@material-ui/icons";
import clsx from "clsx";
import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer, Column, SortDirectionType, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import useLocalStorage from "../../common/hooks/useLocalStorage";
import { HashMap } from "../../genericTypes";
import {
  selectFavoriteCountries,
  selectFilteredAndOrderedCountries,
  toggleFavorite,
  updateFavoriteCountries,
} from "../countries/countriesSlice";
import { Country, Status } from "../countries/countriesTypes";
import { setViewport } from "../map/mapSlice";
import {
  selectFilterBy,
  selectIsTableVisibleOnMobile,
  selectMomentTimelineDate,
  selectSortBy,
  selectSortDirection,
  setFilterBy,
  sort,
  toggleTableVisibility,
} from "../sideBar/sideBarSlice";
import { FilterBy } from "../sideBar/sideBarTypes";
import styles from "./CountriesTable.module.scss";
import { headerRenderer } from "./CountriesTableHeader";

export function CountriesTable() {
  const dispatch = useDispatch();
  const isFavoritesInitialized = useRef<boolean>(false);
  const countries: Country[] = useSelector(selectFilteredAndOrderedCountries);
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const favoriteCountries: HashMap<boolean> = useSelector(
    selectFavoriteCountries
  );
  const [favoriteCountriesLS, setFavoriteCountriesLS] = useLocalStorage<
    HashMap<boolean>
  >("favoriteCountries", favoriteCountries);
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const sortBy: string = useSelector(selectSortBy);
  const sortDirection: SortDirectionType = useSelector(selectSortDirection);
  const isTableVisibleOnMobile: boolean = useSelector(
    selectIsTableVisibleOnMobile
  );

  useEffect(() => {
    if (!isFavoritesInitialized.current) {
      isFavoritesInitialized.current = true;
      dispatch(updateFavoriteCountries(favoriteCountriesLS));
    } else {
      if (!_.isEqual(favoriteCountries, favoriteCountriesLS)) {
        setFavoriteCountriesLS(favoriteCountries);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteCountries]);

  return (
    <div style={{ height: "100%" }}>
      <div
        className={clsx(
          styles.container,
          !isTableVisibleOnMobile && styles.hiddenContainer
        )}
      >
        <AutoSizer>
          {({ width, height }) => {
            const indexWidth: number = 30;
            const favWidth: number = 50;
            const widthWithoutIndexAndFav =
              (width - (indexWidth + favWidth)) / 100;
            const colWidth = widthWithoutIndexAndFav * 20;
            const countryWidth = widthWithoutIndexAndFav * 20;

            return (
              <Table
                width={width}
                height={height}
                headerHeight={40}
                rowHeight={50}
                rowCount={countries.length}
                rowClassName={rowClassName}
                rowGetter={({ index }) => countries[index]}
                onRowClick={({ rowData }: { rowData: Country }) => {
                  if (isTableVisibleOnMobile) {
                    dispatch(toggleTableVisibility());
                  }

                  dispatch(
                    setViewport({
                      longitude: rowData.coordinates.longitude,
                      latitude: rowData.coordinates.latitude,
                      zoom: 6,
                    })
                  );
                }}
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
                  className={styles.countryCol}
                  label="Country"
                  dataKey="country"
                  defaultSortDirection="ASC"
                  headerRenderer={headerRenderer}
                />
                {[
                  { label: "Confirmed", status: Status.Confirmed },
                  { label: "Recovered", status: Status.Recovered },
                  { label: "Deaths", status: Status.Deaths },
                  { label: "Active", status: Status.Active },
                ].map((column) => (
                  <Column
                    key={column.status}
                    label={column.label}
                    dataKey={column.status}
                    defaultSortDirection="DESC"
                    width={colWidth}
                    headerRenderer={headerRenderer}
                    cellDataGetter={({ dataKey, rowData }) =>
                      rowData.timeline[dataKey][date]?.toLocaleString() || 0
                    }
                  />
                ))}
                <Column
                  label=""
                  dataKey="favorite"
                  disableSort
                  width={favWidth}
                  headerRenderer={() => {
                    const StarIcon = filterBy.favorite ? Star : StarBorder;

                    return (
                      <StarIcon
                        className={styles.favoriteIcon}
                        data-testid="filter-by-favorite"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            setFilterBy({
                              ...filterBy,
                              favorite: !filterBy.favorite,
                            })
                          );
                        }}
                      />
                    );
                  }}
                  cellRenderer={({ rowData }) => {
                    const StarIcon = favoriteCountries[rowData.country]
                      ? Star
                      : StarBorder;

                    return (
                      <StarIcon
                        className={styles.favoriteIcon}
                        data-testid="toggle-favorite"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleFavorite(rowData.country));
                        }}
                      />
                    );
                  }}
                />
              </Table>
            );
          }}
        </AutoSizer>
      </div>
      <button
        className={styles.toggleTable}
        onClick={() => dispatch(toggleTableVisibility())}
      >
        {`${isTableVisibleOnMobile ? "Hide" : "Show"} table`}
      </button>
    </div>
  );
}

function rowClassName({ index }: { index: number }): string {
  if (index >= 0) {
    return index % 2 ? styles.evenRow : styles.oddRow;
  }

  return styles.headerRow;
}
