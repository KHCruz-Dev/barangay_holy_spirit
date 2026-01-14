import { FaIdCard } from "react-icons/fa";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";
import { RESIDENT_ACTIONS } from "../reducers/residentReducer";

const AlagangValmocinaIdSection = ({
  canManageID,
  idStatus,
  dispatchResident,
  onGenerateID,
  onUpdateStatus, // ✅ ADD
}) => {
  if (!canManageID) return null;

  return (
    <div className="bg-gray-50 border border-green-900 rounded-lg p-4 space-y-4">
      <h3 className="text-xs uppercase font-semibold text-gray-600 flex items-center gap-2">
        <FaIdCard className="text-green-700" />
        Alagang Valmocina ID Details
      </h3>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <ComboBoxFloatingLabel
          id="idStatus"
          label="ID Status"
          value={idStatus}
          options={[
            { label: "Pending ID", value: "Pending" },
            { label: "Generated", value: "Generated" },
            { label: "Printed", value: "Printed" },
            { label: "For Distribution", value: "For Distribution" },
            { label: "Distributed", value: "Distributed" },
          ]}
          onChange={(value) =>
            dispatchResident({
              type: RESIDENT_ACTIONS.SET_FIELD,
              field: "idStatus",
              value,
            })
          }
          requireMatch
        />

        {/* ✅ UPDATE STATUS */}
        <button
          type="button"
          onClick={onUpdateStatus}
          className="min-w-[140px] px-6 py-2 text-sm font-medium
            text-green-800 border border-green-800 rounded-lg
            hover:bg-green-800 hover:text-white transition"
        >
          Update Status
        </button>

        {/* GENERATE ID */}
        <button
          type="button"
          onClick={onGenerateID}
          className="min-w-[140px] px-6 py-2 text-sm font-medium
            text-blue-700 border border-blue-300 rounded-lg
            hover:bg-blue-50 hover:border-blue-400 transition"
        >
          Generate ID
        </button>
      </div>
    </div>
  );
};

export default AlagangValmocinaIdSection;
