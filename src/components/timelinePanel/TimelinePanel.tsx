import moment, { Moment } from "moment";
import React, { memo, useCallback } from "react";
import "./TimelinePanel.scss";

interface TimelinePanelProps {
  date?: Moment;
  onChange: (date: Moment) => void;
  minDate?: Moment;
  maxDate?: Moment;
}

function TimelinePanel({
  date = moment(),
  onChange,
  minDate,
  maxDate,
}: TimelinePanelProps) {
  const updateValue = useCallback(
    (e) => {
      const newDate = date.clone().dayOfYear(+e.currentTarget.value);
      return onChange(newDate);
    },
    [date, onChange]
  );

  return (
    <div className="timeline-panel" data-testid="timeline-panel">
      <label htmlFor="timeline">{date.format("LL")}</label>
      <input
        id="timeline"
        className="range"
        type="range"
        value={date.dayOfYear()}
        step={1}
        min={minDate?.dayOfYear()}
        max={maxDate?.dayOfYear()}
        onChange={updateValue}
      />
    </div>
  );
}

export default memo(TimelinePanel);
