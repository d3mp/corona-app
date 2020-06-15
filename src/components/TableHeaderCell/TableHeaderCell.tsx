import { TableCell, TableSortLabel, Typography } from "@material-ui/core";
import clsx from "clsx";
import React, { memo } from "react";
import { SortDirection, TableHeaderProps } from "react-virtualized";
import useStyles from "./tableHeaderCell.styles";

const TableHeaderCell = ({
  dataKey,
  label,
  sortBy,
  sortDirection,
  disableSort,
}: TableHeaderProps) => {
  const classes = useStyles();

  return (
    <TableCell
      className={clsx(classes.tableCell, classes.tableHeaderCell)}
      component="div"
      key={dataKey}
      variant="head"
    >
      {disableSort ? (
        label
      ) : (
        <TableSortLabel
          active={sortBy === dataKey}
          direction={sortDirection === SortDirection.DESC ? "desc" : "asc"}
        >
          <Typography className={classes.label}>{label}</Typography>
        </TableSortLabel>
      )}
    </TableCell>
  );
};

export default memo(TableHeaderCell);
