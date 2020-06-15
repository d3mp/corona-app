import { TableCell } from "@material-ui/core";
import React, { memo } from "react";
import { TableCellProps } from "react-virtualized";
import useStyles from "./tableBodyCell.styles";

const TableBodyCell = ({ cellData, dataKey }: TableCellProps) => {
  const classes = useStyles();

  return (
    <TableCell
      className={classes.tableCell}
      component="div"
      key={dataKey}
      variant="body"
    >
      {cellData}
    </TableCell>
  );
};

export default memo(TableBodyCell);
