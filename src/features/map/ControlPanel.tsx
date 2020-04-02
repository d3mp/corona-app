import React, { memo, useState, useCallback } from "react";
import moment, { Moment } from "moment";
import "./ControlPanel.css";

interface ControlPanelProps {
  onChange: (date: Moment) => void;
}

function ControlPanel({ onChange }: ControlPanelProps) {
  const minDateTime: Moment = moment("2020-01-22T00:00:00");
  const maxDateTime: Moment = moment();
  const [date, setDate] = useState(maxDateTime);
  const updateValue = useCallback(
    (e) => {
      const newDate = date.clone().dayOfYear(+e.currentTarget.value);
      setDate(newDate);
      onChange(newDate);
    },
    [date, onChange]
  );

  return (
    <div className="control-panel">
      <label>{date.format("LL")}</label>
      <input
        className="range"
        type="range"
        value={date.dayOfYear()}
        step={1}
        min={minDateTime.dayOfYear()}
        max={maxDateTime.dayOfYear()}
        onChange={updateValue}
      />
    </div>
  );
}

export default memo(ControlPanel);
