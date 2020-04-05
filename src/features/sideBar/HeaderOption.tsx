import React from "react";
import clsx from "clsx";
import styles from "./SideBar.module.css";

interface HeaderOption {
  label: string;
  quantity: number;
  activeColor: string;
  isActive: boolean;
  onClick: () => void;
}

export function HeaderOption({
  label,
  quantity,
  activeColor,
  isActive,
  onClick,
}: HeaderOption) {
  return (
    <div
      className={clsx(styles.headerStat, isActive && styles.headerStatActive)}
      style={isActive ? { color: activeColor } : {}}
      onClick={onClick}
    >
      <div className={styles.headerStatLabel}>{label}</div>
      <div className={styles.headerStatTotalQuantity}>
        {quantity.toLocaleString()}
      </div>
    </div>
  );
}
