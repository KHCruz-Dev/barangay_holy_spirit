import { FaMapMarkerAlt } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";

const AddressSection = ({
  resident,
  errors,
  handleBlur,

  regionData,
  provinceOptions,
  municipalityOptions,
  barangayOptions,
  subdivisionOptions,
  streetOptions,

  handleRegionChange,
  handleProvinceChange,
  handleMunicipalityChange,
  handleBarangayChange,
  handleSubdivisionChange,
  handleStreetChange,
  updateResident,
}) => {
  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaMapMarkerAlt className="text-green-800" />
        Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Region */}
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
          }}
        />

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
          }}
        />

        <ComboBoxFloatingLabel
          label="Subdivision / Village"
          options={subdivisionOptions}
          value={resident.subdivisionVillage}
          requireMatch
          disabled={!resident.barangay}
          isInvalid={!!errors.subdivisionVillage}
          errorMessage={errors.subdivisionVillage}
          onChange={(value) => {
            handleSubdivisionChange(value);
          }}
        />

        <ComboBoxFloatingLabel
          label="Street / Road"
          options={streetOptions}
          value={resident.streetRoad}
          requireMatch
          disabled={!resident.subdivisionVillage}
          isInvalid={!!errors.streetRoad}
          errorMessage={errors.streetRoad}
          onChange={(value) => {
            handleStreetChange(value);
          }}
        />

        {/* Street Number */}
        <InputFloatingLabel
          label="Street Number / #"
          value={resident.streetNumber}
          onChange={updateResident("streetNumber")}
          onBlur={() => handleBlur("streetNumber")}
          isInvalid={!!errors.streetNumber}
          errorMessage={errors.streetNumber}
        />
      </div>
    </div>
  );
};

export default AddressSection;
