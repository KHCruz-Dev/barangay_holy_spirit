import { FaAddressCard } from "react-icons/fa";
import DynamicIdentificationCards from "../../../../Common/DynamicIdentificationCards";

const IdentificationCardsSection = ({
  identificationCards,
  idTypeOptions,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaAddressCard className="text-green-800" />
        Identification Cards
      </h3>

      <DynamicIdentificationCards
        cards={identificationCards}
        idTypeOptions={idTypeOptions}
        onAdd={onAdd}
        onRemove={onRemove}
        onChange={onChange}
      />
    </div>
  );
};

export default IdentificationCardsSection;
