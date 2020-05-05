import clsx from "clsx";
import React from "react";
import styles from "./SideBar.module.css";

interface SideBarTotalCount {
  label: string;
  quantity: number;
  activeColor: string;
  isActive: boolean;
  onClick: () => void;
}

export function SideBarTotalCount({
  label,
  quantity,
  activeColor,
  isActive,
  onClick,
}: SideBarTotalCount) {
  return (
    <div
      className={clsx(styles.totalCount, isActive && styles.totalCountActive)}
      style={isActive ? { color: activeColor } : {}}
      onClick={onClick}
    >
      <div className={styles.totalCountLabel} data-testid="total-count-label">
        {label}
      </div>
      <div
        className={styles.totalCountTotalQuantity}
        data-testid="total-count-value"
      >
        {quantity.toLocaleString()}
      </div>
    </div>
  );
}