// src/utils/hooks/useTimePicker.js
import { useState } from "react";

export const useTimePicker = (
  initialHour = "08",
  initialMinute = "00",
  initialPeriod = "AM"
) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  return {
    hour,
    minute,
    period,
    setHour,
    setMinute,
    setPeriod,
    onHourChange: (e) => setHour(e.target.value),
    onMinuteChange: (e) => setMinute(e.target.value),
    onPeriodChange: (e) => setPeriod(e.target.value),
  };
};
