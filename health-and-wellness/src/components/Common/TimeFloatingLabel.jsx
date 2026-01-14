import React, { useEffect, useState } from "react";
import Select from "react-select";

const TimeFloatingLabel = ({
  id,
  label,
  value = "",
  onChange,
  disabled = false,
}) => {
  const [hour, setHour] = useState({ value: "01", label: "01" });
  const [minute, setMinute] = useState({ value: "00", label: "00" });
  const [period, setPeriod] = useState({ value: "AM", label: "AM" });
  const [focusField, setFocusField] = useState("");
  const [touchedFields, setTouchedFields] = useState({
    hour: false,
    minute: false,
    period: false,
  });

  const hourOptions = [...Array(12)].map((_, i) => {
    const h = String(i + 1).padStart(2, "0");
    return { value: h, label: h };
  });

  const minuteOptions = [...Array(60)].map((_, i) => {
    const m = String(i).padStart(2, "0");
    return { value: m, label: m };
  });

  const periodOptions = ["AM", "PM"].map((p) => ({ value: p, label: p }));

  useEffect(() => {
    if (value) {
      const match = value.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
      if (match) {
        const [, h, m, p] = match;
        setHour({ value: h.padStart(2, "0"), label: h.padStart(2, "0") });
        setMinute({ value: m, label: m });
        setPeriod({ value: p.toUpperCase(), label: p.toUpperCase() });
      }
    }
  }, [value]);

  const handleChange = (newHour, newMinute, newPeriod) => {
    const finalHour = newHour?.value || hour.value;
    const finalMinute = newMinute?.value || minute.value;
    const finalPeriod = newPeriod?.value || period.value;

    setHour({ value: finalHour, label: finalHour });
    setMinute({ value: finalMinute, label: finalMinute });
    setPeriod({ value: finalPeriod, label: finalPeriod });

    if (onChange) {
      onChange(`${finalHour}:${finalMinute}${finalPeriod}`);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
      paddingTop: "0.1rem",
      paddingBottom: "0rem",
      cursor: "pointer",
      zIndex: 1,
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      fontSize: "0.875rem",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#DBEAFE"
        : isFocused
        ? "#EFF6FF"
        : "#ffffff",
      color: "#1F2937",
      cursor: "pointer",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "2px",
    }),
  };

  const selectWrapperClass = (field) => {
    const isFocused = focusField === field;
    const wasTouched = touchedFields[field];

    return `
      relative w-1/3
      transition-all duration-200 ease-in-out
      ${disabled ? "bg-gray-100" : ""}
      ${isFocused ? "ring-2 ring-green-600 shadow-sm rounded-md bg-white" : ""}
      before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:rounded-sm
      before:transition-all before:duration-200
      ${
        wasTouched && !isFocused && !disabled
          ? "before:bg-green-600"
          : !wasTouched && !disabled
          ? "before:bg-gray-300"
          : "before:bg-transparent"
      }
    `;
  };

  const labelClass = `
    absolute left-2 top-2 text-sm transition-all duration-200 bg-white z-10
    ${disabled ? "text-gray-400" : "text-gray-800"}
  `;

  const handleMenuOpen = (field) => {
    setFocusField(field);
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleMenuClose = () => {
    setFocusField("");
  };

  return (
    <div className="relative w-full">
      <span className={labelClass}>{label}</span>
      <div className="mt-6 flex gap-2">
        {/* HOUR */}
        <div className={selectWrapperClass("hour")}>
          <Select
            inputId={`${id}-hour`}
            value={hour}
            onChange={(val) => handleChange(val, minute, period)}
            onMenuOpen={() => handleMenuOpen("hour")}
            onMenuClose={handleMenuClose}
            options={hourOptions}
            styles={customStyles}
            isDisabled={disabled}
          />
        </div>

        {/* MINUTE */}
        <div className={selectWrapperClass("minute")}>
          <Select
            inputId={`${id}-minute`}
            value={minute}
            onChange={(val) => handleChange(hour, val, period)}
            onMenuOpen={() => handleMenuOpen("minute")}
            onMenuClose={handleMenuClose}
            options={minuteOptions}
            styles={customStyles}
            isDisabled={disabled}
          />
        </div>

        {/* PERIOD */}
        <div className={selectWrapperClass("period")}>
          <Select
            inputId={`${id}-period`}
            value={period}
            onChange={(val) => handleChange(hour, minute, val)}
            onMenuOpen={() => handleMenuOpen("period")}
            onMenuClose={handleMenuClose}
            options={periodOptions}
            styles={customStyles}
            isDisabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeFloatingLabel;
