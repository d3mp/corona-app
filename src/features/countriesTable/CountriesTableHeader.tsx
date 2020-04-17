import React from "react";
import { SortIndicator, TableHeaderProps } from "react-virtualized";
import styles from "./CountriesTable.module.css";

export function headerRenderer({
  dataKey,
  label,
  sortBy,
  sortDirection,
}: TableHeaderProps): React.ReactNode {
  return (
    <div key={dataKey} className={styles.headerCol}>
      <span>{label}</span>
      <span>
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </span>
    </div>
  );
}
