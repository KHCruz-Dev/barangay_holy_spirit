import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

const DateFloatingLabel = ({
  id,
  label,
  value, // can be Date or string
  onChange,
  disabled = false,
  maxDate = new Date(), // 🔒 default: today = latest allowed
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const dateRef = useRef(null);

  // Sync internal date with external value
  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
      return;
    }

    if (!value) {
      setSelectedDate(null);
      return;
    }

    // value is expected to be YYYY-MM-DD
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      setSelectedDate(new Date(y, m - 1, d)); // 👈 LOCAL DATE (no UTC)
      return;
    }

    // fallback (should rarely happen)
    if (value instanceof Date && !isNaN(value)) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isOpen) setIsFocused(false);
    }, 150);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsFocused(true);

    if (onChange && date instanceof Date && !isNaN(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // ✅ send DATE-ONLY STRING
      onChange(`${year}-${month}-${day}`);
    }
  };

  const isFloating = isFocused || isOpen || selectedDate;
  const isActive = isFocused || isOpen;

  return (
    <div
      className={`relative w-full transition-all duration-200 ease-in-out
        ${
          disabled
            ? ""
            : isActive
            ? "bg-white ring-2 ring-green-600 shadow-sm rounded-md"
            : "border-b-2 border-gray-300 hover:border-green-400"
        }`}
    >
      <DatePicker
        ref={dateRef}
        id={id}
        selected={selectedDate}
        onChange={handleDateChange}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => {
          setIsOpen(false);
          setIsFocused(false);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeRaw={(e) => e.preventDefault()} // ❌ no manual typing
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="MMMM d, yyyy"
        disabled={disabled}
        placeholderText=" "
        maxDate={maxDate} // 🔒 cannot pick beyond this (today by default)
        className={`peer w-full border-0 bg-transparent px-2 pt-7 pb-1 pr-8 text-sm text-gray-800 transition-all
          ${
            disabled
              ? "text-gray-400 bg-gray-100 cursor-not-allowed rounded-md"
              : ""
          }`}
        popperClassName="custom-datepicker-popup"
        popperPlacement="bottom-start"
        portalId="datepicker-root"
      />

      <label
        htmlFor={id}
        className={`absolute left-2 text-sm transition-all duration-200
          ${
            disabled
              ? "text-gray-400"
              : isActive
              ? "text-green-600"
              : "text-gray-500"
          }
          ${isFloating ? "top-1" : "top-6"}
        `}
      >
        {label}
      </label>

      <FaRegCalendarAlt
        className={`absolute right-2 top-[2rem] w-4 h-4 pointer-events-none transition-transform duration-200 ease-in-out
          ${
            disabled
              ? "text-gray-300"
              : isActive
              ? "text-green-600 scale-110"
              : "text-gray-500"
          }`}
      />
    </div>
  );
};

export default DateFloatingLabel;
