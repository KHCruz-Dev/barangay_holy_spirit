import { FaMapMarkerAlt } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";

const NonResidentAddressSection = ({
  resident,
  errors,
  handleBlur,

  regionData = [],
  provinceOptions = [],
  municipalityOptions = [],
  barangayOptions = [],

  handleRegionChange,
  handleProvinceChange,
  handleMunicipalityChange,
  handleBarangayChange,

  updateResident,
}) => {
  const hasRegion = !!resident.regionId;
  const hasProvince = !!resident.provinceId;
  const hasMunicipality = !!resident.municipalityId;
  const hasBarangay = !!resident.barangayId;

  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaMapMarkerAlt className="text-green-800" />
        Address (Non-Resident)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Region */}
        <ComboBoxFloatingLabel
          label="Region"
          options={regionData}
          value={resident.regionId}
          requireMatch
          isInvalid={!!errors.regionId}
          errorMessage={errors.regionId}
          onChange={handleRegionChange}
        />

        {/* Province */}
        <ComboBoxFloatingLabel
          label="Province"
          options={provinceOptions}
          value={resident.provinceId}
          requireMatch
          disabled={!hasRegion}
          onChange={handleProvinceChange}
        />

        {/* Municipality */}
        <ComboBoxFloatingLabel
          label="City / Municipality"
          options={municipalityOptions}
          value={resident.municipalityId}
          requireMatch
          disabled={!hasProvince}
          onChange={handleMunicipalityChange}
        />

        {/* Barangay */}
        <ComboBoxFloatingLabel
          label="Barangay"
          options={barangayOptions}
          value={resident.barangayId}
          requireMatch
          disabled={!hasMunicipality}
          onChange={handleBarangayChange}
        />

        {/* Street Address Line */}
        <div className="sm:col-span-2 lg:col-span-2">
          <InputFloatingLabel
            label="Street Address Line (Subdivision/Area, Street, #)"
            value={resident.streetAddressLine || ""}
            disabled={!hasBarangay}
            onChange={updateResident("streetAddressLine")}
            onBlur={() => handleBlur("streetAddressLine")}
            isInvalid={!!errors.streetAddressLine}
            errorMessage={errors.streetAddressLine}
          />
        </div>
      </div>
    </div>
  );
};

export default NonResidentAddressSection;
