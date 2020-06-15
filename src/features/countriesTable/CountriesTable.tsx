import { Paper } from "@material-ui/core";
import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AutoSizer,
  Column,
  SortDirectionType,
  Table,
  TableCellProps,
  TableHeaderProps,
} from "react-virtualized";
import "react-virtualized/styles.css";
import { SHORT_DATE_FORMAT } from "../../common/constants/global";
import { FavoriteButton } from "../../components/FavoriteButton/FavoriteButton";
import TableBodyCell from "../../components/TableBodyCell/TableBodyCell";
import TableHeaderCell from "../../components/TableHeaderCell/TableHeaderCell";
import { TabsContext } from "../../contexts/TabsContext";
import { HashMap } from "../../genericTypes";
import {
  selectFavoriteCountries,
  selectFilteredAndOrderedCountries,
  toggleFavorite,
} from "../countries/countriesSlice";
import { Country, Status } from "../countries/countriesTypes";
import { setViewport } from "../map/mapSlice";
import {
  selectFilterBy,
  selectMomentTimelineDate,
  selectSortBy,
  selectSortDirection,
  setFilterBy,
  sort,
} from "../sideBar/sideBarSlice";
import { FilterBy } from "../sideBar/sideBarTypes";
import useStyles, { headerHeight, rowHeight } from "./countriesTable.styles";

const headerRenderer = (props: TableHeaderProps) => (
  <TableHeaderCell {...props} />
);
const cellRenderer = (props: TableCellProps) => <TableBodyCell {...props} />;

export function CountriesTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tabsContext = useContext(TabsContext);
  const countries: Country[] = useSelector(selectFilteredAndOrderedCountries);
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const favoriteCountries: HashMap<boolean> = useSelector(
    selectFavoriteCountries
  );
  const date: string = useSelector(selectMomentTimelineDate).format(
    SHORT_DATE_FORMAT
  );
  const sortBy: string = useSelector(selectSortBy);
  const sortDirection: SortDirectionType = useSelector(selectSortDirection);

  const onFavoriteHeaderClick = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(
        setFilterBy({
          ...filterBy,
          favorite: !filterBy.favorite,
        })
      );
    },
    [dispatch, filterBy]
  );

  const favoriteHeaderRenderer = useCallback(
    (props: TableHeaderProps) => {
      return headerRenderer({
        ...props,
        label: (
          <FavoriteButton
            isFavorite={filterBy.favorite}
            onClick={onFavoriteHeaderClick}
          />
        ),
      });
    },
    [filterBy.favorite, onFavoriteHeaderClick]
  );

  const favoriteCellRenderer = useCallback(
    (props: TableCellProps) => {
      return cellRenderer({
        ...props,
        cellData: (
          <FavoriteButton
            isFavorite={favoriteCountries[props.rowData.country]}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleFavorite(props.rowData.country));
            }}
          />
        ),
      });
    },
    [dispatch, favoriteCountries]
  );

  return (
    <Paper className={classes.root}>
      <AutoSizer>
        {({ width, height }) => {
          const indexWidth: number = 40;
          const favWidth: number = 32 + 16; // 16 - side padding
          const widthWithoutIndexAndFav =
            (width - (indexWidth + favWidth)) / 100;
          const colWidth = widthWithoutIndexAndFav * 20;
          const countryWidth = widthWithoutIndexAndFav * 20;

          return (
            <Table
              width={width}
              height={height}
              headerHeight={headerHeight}
              headerClassName={classes.rowColumn}
              overscanRowCount={3}
              rowHeight={rowHeight}
              rowCount={countries.length}
              rowClassName={classes.rowColumn}
              rowGetter={({ index }) => countries[index]}
              onRowClick={({ rowData }: { rowData: Country }) => {
                tabsContext.setTab(1);

                setTimeout(() => {
                  dispatch(
                    setViewport({
                      longitude: rowData.coordinates.longitude,
                      latitude: rowData.coordinates.latitude,
                      zoom: 6,
                    })
                  );
                }, 200);
              }}
              sort={({ sortBy, sortDirection }) =>
                dispatch(sort({ sortBy, sortDirection }))
              }
              sortBy={sortBy}
              sortDirection={sortDirection}
            >
              <Column
                className={classes.rowColumn}
                label="#"
                dataKey="index"
                disableSort
                width={indexWidth}
                cellRenderer={cellRenderer}
                headerRenderer={headerRenderer}
              />
              <Column
                className={classes.rowColumn}
                label="Country"
                dataKey="country"
                defaultSortDirection="ASC"
                cellRenderer={(props: TableCellProps) =>
                  cellRenderer({
                    ...props,
                    cellData: (
                      <div className={classes.doubleLine}>{props.cellData}</div>
                    ),
                  })
                }
                flexGrow={1}
                headerRenderer={headerRenderer}
                width={countryWidth}
              />
              {[
                { label: "Confirmed", status: Status.Confirmed },
                { label: "Recovered", status: Status.Recovered },
                { label: "Deaths", status: Status.Deaths },
                { label: "Active", status: Status.Active },
              ].map((column) => (
                <Column
                  className={classes.rowColumn}
                  cellDataGetter={({ dataKey, rowData }) =>
                    rowData.timeline[dataKey][date]?.toLocaleString() || 0
                  }
                  cellRenderer={cellRenderer}
                  dataKey={column.status}
                  defaultSortDirection="DESC"
                  headerRenderer={headerRenderer}
                  key={column.status}
                  label={column.label}
                  width={colWidth}
                />
              ))}
              <Column
                className={classes.rowColumn}
                cellRenderer={favoriteCellRenderer}
                dataKey="favorite"
                disableSort
                headerRenderer={favoriteHeaderRenderer}
                label=""
                width={favWidth}
              />
            </Table>
          );
        }}
      </AutoSizer>
    </Paper>
  );
}
