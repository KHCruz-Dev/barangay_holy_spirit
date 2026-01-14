import React, { useState, useEffect, useMemo, useRef } from "react";

import { createPortal } from "react-dom";

const ComboBoxFloatingLabel = ({
  id,
  label,
  disabled = false,
  options = [], // [{ value, label, keywords?: [] }]
  value, // controlled selected value (option.value)
  onChange, // called ONLY when a valid option is selected
  requireMatch = false,
  onInvalidSelection, // optional: (inputText) => {}
  onBlur,
  isInvalid: externalInvalid = false, // 🔴 NEW
  errorMessage, // 🔴 NEW
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalInvalid, setInternalInvalid] = useState(false); // renamed
  const inputRef = useRef(null);

  const isInvalid = externalInvalid || internalInvalid; // ✅ combine

  // Helper: advanced match (label + acronym + keywords)
  const matchesOption = (opt, query) => {
    if (!query) return true;

    const q = query.trim().toLowerCase();
    const label = (opt.label ?? "").toLowerCase();
    const keywords = (opt.keywords || []).map((k) => k.toLowerCase());

    const acronym = opt.label
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toLowerCase();

    if (label.includes(q)) return true;
    if (keywords.some((k) => k.includes(q))) return true;
    if (acronym.includes(q)) return true;

    const queryWords = q.split(/\s+/);
    const labelWords = label.split(/\s+/);

    const allWordsMatch = queryWords.every((word) =>
      labelWords.some((lw) => lw.includes(word))
    );

    if (allWordsMatch) return true;

    return false;
  };

  // Keep input text in sync with selected value
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    if (selected) {
      setInputValue(selected.label);
      setInternalInvalid(false);
    } else if (!requireMatch) {
      setInternalInvalid(false);
      // In free-text mode, don’t force clear
    } else {
      setInputValue("");
    }
  }, [value, options, requireMatch]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter((opt) => matchesOption(opt, inputValue));
  }, [inputValue, options]);

  const handleInputMouseDown = (e) => {
    if (disabled) return;

    if (!isOpen && (value || inputValue)) {
      if (onChange) onChange(""); // or undefined
      setInputValue("");
      setInternalInvalid(false);
      setHighlightedIndex(-1);
      setIsOpen(true);
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(0);
    setInternalInvalid(false);
  };

  const handleOptionSelect = (opt) => {
    setInputValue(opt.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    setInternalInvalid(false);

    // ✅ update value
    if (onChange) onChange(opt.value);

    // ✅ CLEAR validation IMMEDIATELY (no timeout)
    if (onBlur) onBlur();
  };

  const validateInput = () => {
    // ✅ If parent already has a valid value, DO NOTHING
    if (value) {
      setInternalInvalid(false);
      return;
    }

    if (!requireMatch) {
      setInternalInvalid(false);
      return;
    }

    const trimmed = inputValue.trim();

    if (!trimmed) {
      setInternalInvalid(true);
      return;
    }

    const exactMatch = options.find(
      (opt) => opt.label?.toLowerCase() === trimmed.toLowerCase()
    );

    if (exactMatch) {
      if (onChange) onChange(exactMatch.value);
      setInternalInvalid(false);
    } else {
      setInternalInvalid(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!filteredOptions.length) {
      if (e.key === "Enter" && requireMatch) {
        e.preventDefault();
        validateInput();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
      } else if (requireMatch) {
        validateInput();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      validateInput();
      // ❌ DO NOT call onBlur here
    }, 100);
  };

  useEffect(() => {
    const handler = () => setIsOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const shouldDropUp = useMemo(() => {
    if (!inputRef.current) return false;

    const rect = inputRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    return spaceBelow < 240 && spaceAbove > spaceBelow;
  }, [isOpen]);

  const dropdownStyle = useMemo(() => {
    if (!inputRef.current) return {};

    const rect = inputRef.current.getBoundingClientRect();
    const margin = 12;
    const dropdownHeight = 192; // max-h-48

    let left = rect.left;

    if (left + rect.width > window.innerWidth - margin) {
      left = window.innerWidth - rect.width - margin;
    }
    if (left < margin) left = margin;

    return {
      left,
      width: rect.width,
      maxWidth: "calc(100vw - 24px)",
      top: shouldDropUp
        ? rect.top - dropdownHeight + 1 // ✅ OVERLAP border (DROPUP)
        : rect.bottom - 1, // ✅ OVERLAP border (DROPDOWN)
    };
  }, [isOpen, shouldDropUp]);

  return (
    <div
      className={`relative z-40 w-full transition-all duration-200 ease-in-out ${
        disabled
          ? ""
          : isOpen
          ? "bg-white ring-2 ring-green-600 shadow-sm rounded-md"
          : ""
      }`}
    >
      {/* Input (combobox text field) */}
      <input
        id={id}
        type="text"
        ref={inputRef}
        value={inputValue}
        disabled={disabled}
        placeholder=" "
        onMouseDown={handleInputMouseDown}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-invalid={isInvalid}
        className={`peer w-full px-2 pt-7 pb-1 pr-8 text-sm focus:outline-none transition-all
          ${
            disabled
              ? "border border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed rounded-md"
              : isInvalid
              ? "border border-red-500 text-red-800 bg-white rounded-md focus:border-red-600"
              : isOpen
              ? "border border-green-300 text-gray-900 bg-white rounded-md"
              : "border-0 border-b-2 border-gray-300 focus:border-green-600 bg-transparent text-gray-800"
          }
        `}
      />

      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-2 top-1 text-sm transition-all duration-200
          ${
            disabled
              ? "text-gray-400"
              : isInvalid
              ? "text-red-600"
              : "text-gray-800 peer-focus:text-green-600"
          }
          peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm
          peer-focus:top-1 peer-focus:text-xs
        `}
      >
        {label}
      </label>

      {/* Dropdown Arrow */}
      <svg
        className={`absolute right-2 top-[2rem] pointer-events-none w-4 h-4
          transition-transform duration-200 ease-in-out ${
            disabled
              ? "text-gray-300"
              : isOpen
              ? "text-gray-800 rotate-180"
              : "text-gray-500"
          }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {/* Options Dropdown */}
      {isOpen &&
        !disabled &&
        filteredOptions.length > 0 &&
        createPortal(
          <ul
            className="fixed z-[9999] max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg text-sm"
            style={dropdownStyle}
          >
            {filteredOptions.map((opt, index) => (
              <li
                key={opt.value ?? opt.label ?? index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOptionSelect(opt);
                }}
                className={`cursor-pointer px-3 py-2 hover:bg-green-50 ${
                  index === highlightedIndex ? "bg-green-50" : ""
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body
        )}

      {/* No results */}
      {isOpen && !disabled && filteredOptions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 shadow-lg">
          No results found
        </div>
      )}

      {/* Error message from parent */}
      {errorMessage && isInvalid && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default ComboBoxFloatingLabel;
