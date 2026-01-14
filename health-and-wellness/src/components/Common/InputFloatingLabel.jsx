import React, { useState, useRef } from "react";

const InputFloatingLabel = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = " ",
  disabled = false,
  readOnly = false,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const safeValue = value ?? "";
  const isContactField = id === "contact";

  // 👀 Display value logic
  const displayValue = isContactField
    ? focused
      ? safeValue
      : safeValue
      ? `+639${safeValue.slice(1)}` // 👈 ensures +639XXXXXXXXX
      : ""
    : safeValue;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={type}
        id={id}
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          if (!onChange) return;

          let val = e.target.value;

          if (isContactField) {
            // Remove +639 or +63 or any non-digits
            val = val.replace(/^(\+639|\+63)/, "");
            val = val.replace(/\D/g, "").slice(0, 10);

            onChange({
              target: {
                id,
                value: val,
              },
            });
          } else {
            onChange(e);
          }
        }}
        className={`peer w-full border-0 border-b-2 bg-transparent px-2 pt-7 pb-1 text-sm focus:outline-none
          ${
            disabled
              ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
              : readOnly
              ? "border-gray-300 text-gray-600 cursor-default"
              : "border-gray-300 text-gray-800 focus:border-green-600"
          }`}
      />

      <label
        htmlFor={id}
        className={`absolute left-2 top-1 text-sm transition-all duration-200
          ${
            disabled
              ? "text-gray-400"
              : "text-gray-800 peer-focus:text-green-600"
          }
          peer-placeholder-shown:top-6 peer-focus:top-1`}
      >
        {label}
      </label>
    </div>
  );
};

export default InputFloatingLabel;
