import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import InputFloatingLabel from "./InputFloatingLabel";
import ComboBoxFloatingLabel from "./ComboFloatingLabel";

const DynamicIdentificationCards = ({
  cards = [],
  idTypeOptions = [],
  onAdd,
  onRemove,
  onChange,
}) => {
  // Detect if any empty card exists (kept for future UX control)
  const hasEmptyCard = cards.some((c) => !c.idTypeId && !c.idNumber);

  // Used ID types (to prevent duplicates)
  const usedTypeIds = cards.map((c) => c.idTypeId).filter(Boolean);

  const getOptions = (currentIndex) =>
    idTypeOptions.filter(
      (opt) =>
        !usedTypeIds.includes(opt.value) ||
        opt.value === cards[currentIndex]?.idTypeId,
    );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((row, index) => {
          const isOnlyCard = cards.length === 1;

          return (
            <div
              key={index}
              className="border rounded-xl p-5 bg-white space-y-4 shadow-sm"
            >
              <ComboBoxFloatingLabel
                label="ID Type"
                options={getOptions(index)}
                value={row.idTypeId}
                onChange={(val) => onChange(index, "idTypeId", val)}
                requireMatch
              />

              <InputFloatingLabel
                label="ID Number"
                value={row.idNumber}
                onChange={(e) => onChange(index, "idNumber", e.target.value)}
              />

              {/* ✅ Allow removal of BOTH existing and blank cards */}
              {/* ❌ Prevent removing the last remaining card */}
              {!isOnlyCard && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="px-4 py-2 text-sm font-semibold text-red-700 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                  >
                    <FaTrashAlt />
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Always visible */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onAdd}
          className="text-sm font-semibold text-green-800 hover:underline"
        >
          + Add another ID
        </button>
      </div>
    </>
  );
};

export default DynamicIdentificationCards;
