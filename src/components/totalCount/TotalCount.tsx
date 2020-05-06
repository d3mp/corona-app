import clsx from "clsx";
import React from "react";
import styles from "./TotalCount.module.scss";

interface TotalCount {
  label: string;
  quantity: number;
  activeColor: string;
  isActive: boolean;
  onClick: () => void;
}

function TotalCount({
  label,
  quantity,
  activeColor,
  isActive,
  onClick,
}: TotalCount) {
  return (
    <div
      className={clsx(styles.totalCount, isActive && styles.active)}
      style={isActive ? { color: activeColor } : {}}
      onClick={onClick}
    >
      <div className={styles.label} data-testid="total-count-label">
        {label}
      </div>
      <div className={styles.quantity} data-testid="total-count-value">
        {quantity.toLocaleString()}
      </div>
    </div>
  );
}

export { TotalCount };
