import { FaMapMarkerAlt } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";

const NonResidentAddressSection = ({
  resident,
  errors,
  handleBlur,

  regionData,
  provinceOptions,
  municipalityOptions,
  barangayOptions, // ✅ ADD

  handleRegionChange,
  handleProvinceChange,
  handleMunicipalityChange,
  handleBarangayChange, // ✅ ADD

  updateResident,
}) => {
  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaMapMarkerAlt className="text-green-800" />
        Address (Non-Resident)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ComboBoxFloatingLabel
          label="Region"
          options={regionData}
          value={resident.region}
          requireMatch
          isInvalid={!!errors.region}
          errorMessage={errors.region}
          onChange={(value) => {
            handleRegionChange(value);
            handleBlur("region");
          }}
        />

        <ComboBoxFloatingLabel
          label="Province"
          options={provinceOptions}
          value={resident.province}
          requireMatch
          disabled={!resident.region}
          isInvalid={!!errors.province}
          errorMessage={errors.province}
          onChange={(value) => {
            handleProvinceChange(value);
            handleBlur("province");
          }}
        />

        <ComboBoxFloatingLabel
          label="City / Municipality"
          options={municipalityOptions}
          value={resident.cityMunicipality}
          requireMatch
          disabled={!resident.province}
          isInvalid={!!errors.cityMunicipality}
          errorMessage={errors.cityMunicipality}
          onChange={(value) => {
            handleMunicipalityChange(value);
            handleBlur("cityMunicipality");
          }}
        />

        {/* ✅ NEW */}
        <ComboBoxFloatingLabel
          label="Barangay"
          options={barangayOptions}
          value={resident.barangay}
          requireMatch
          disabled={!resident.cityMunicipality}
          isInvalid={!!errors.barangay}
          errorMessage={errors.barangay}
          onChange={(value) => {
            handleBarangayChange(value);
            handleBlur("barangay");
          }}
        />

        <div className="sm:col-span-2 lg:col-span-2">
          <InputFloatingLabel
            label="Street Address Line (Subdivision/Area, Street, #)"
            value={resident.streetAddressLine || ""}
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
