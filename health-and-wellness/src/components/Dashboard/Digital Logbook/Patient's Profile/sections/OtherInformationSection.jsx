import { FaPuzzlePiece } from "react-icons/fa";
import ToggleSwitch from "../../../../Common/ToggleSwitch";

const OtherInformationSection = ({
  isVoter,
  isPWD,
  isEmployed,
  isStudent,
  onToggleVoter,
  onTogglePWD,
  onToggleEmployed,
  onToggleStudent,
}) => {
  return (
    <div>
      <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2 pl-6">
        <FaPuzzlePiece className="text-green-800" />
        Other Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ToggleCard label="Voter" checked={isVoter} onToggle={onToggleVoter} />

        <ToggleCard label="PWD" checked={isPWD} onToggle={onTogglePWD} />

        <ToggleCard
          label="Employed"
          checked={isEmployed}
          onToggle={onToggleEmployed}
        />

        <ToggleCard
          label="Student"
          checked={isStudent}
          onToggle={onToggleStudent}
        />
      </div>
    </div>
  );
};

const ToggleCard = ({ label, checked, onToggle }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
    <span className="text-sm text-gray-700">{label}</span>
    <ToggleSwitch checked={checked} onChange={onToggle} />
  </div>
);

export default OtherInformationSection;
