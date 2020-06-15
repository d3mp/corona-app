import React from "react";
import useStyles from "./totalCount.styles";

type Props = {
  label: string;
  quantity: number;
  activeColor: string;
  isActive: boolean;
  onClick: () => void;
};

const TotalCount = ({
  label,
  quantity,
  activeColor,
  isActive,
  onClick,
}: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={isActive ? { color: activeColor } : {}}
      onClick={onClick}
    >
      <div className={classes.label} data-testid="total-count-label">
        {label}
      </div>
      <div className={classes.quantity} data-testid="total-count-value">
        {quantity.toLocaleString()}
      </div>
    </div>
  );
};

export default TotalCount;
