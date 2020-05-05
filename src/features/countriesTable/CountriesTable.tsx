import { Star, StarBorder } from "@material-ui/icons";
import clsx from "clsx";
import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer, Column, SortDirectionType, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import usePrevious from "../../common/hooks/usePrevious";
import { HashMap, Nullable } from "../../genericTypes";
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

const FAVORITE_COUNTRIES = "favoriteCountries";

export function CountriesTable() {
  const dispatch = useDispatch();
  const countries: Country[] = useSelector(selectFilteredAndOrderedCountries);
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const favCountries: HashMap<boolean> = useSelector(selectFavoriteCountries);
  const prevFavCountries: HashMap<boolean> = usePrevious<HashMap<boolean>>(
    favCountries
  );
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const sortBy: string = useSelector(selectSortBy);
  const sortDirection: SortDirectionType = useSelector(selectSortDirection);
  const isTableVisibleOnMobile: boolean = useSelector(
    selectIsTableVisibleOnMobile
  );

  useEffect(() => {
    try {
      const favoriteCountriesJson: Nullable<string> = localStorage.getItem(
        FAVORITE_COUNTRIES
      );

      if (favoriteCountriesJson) {
        const favoriteCountries = JSON.parse(favoriteCountriesJson) as HashMap<
          boolean
        >;
        dispatch(updateFavoriteCountries(favoriteCountries));
      }
    } catch (ex) {
      // TODO: show some error message
      console.warn(ex);
    }
  }, [dispatch]);

  useEffect(() => {
    if (prevFavCountries && !_.isEqual(favCountries, prevFavCountries)) {
      try {
        localStorage.setItem(FAVORITE_COUNTRIES, JSON.stringify(favCountries));
      } catch (ex) {
        // TODO: show some error message
        console.warn(ex);
      }
    }
  }, [favCountries, prevFavCountries]);

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
                    const StarIcon = favCountries[rowData.country]
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
