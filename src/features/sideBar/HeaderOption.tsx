import React from "react";
import styles from "./SideBar.module.css";

interface HeaderOption {
  label: string;
  quantity: number;
}

export function HeaderOption({ label, quantity }: HeaderOption) {
  return (
    <div className={styles.headerStat}>
      <div className={styles.headerStatLabel}>{label}</div>
      <div className={styles.headerStatTotalQuantity}>
        {quantity.toLocaleString()}
      </div>
    </div>
  );
}
