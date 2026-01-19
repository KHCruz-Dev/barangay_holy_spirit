import { FaMapMarkerAlt } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";

const AddressSection = ({
  resident,
  errors,
  handleBlur,

  regionData = [],
  provinceOptions = [],
  municipalityOptions = [],
  barangayOptions = [],
  subdivisionOptions = [],
  streetOptions = [],

  handleRegionChange,
  handleProvinceChange,
  handleMunicipalityChange,
  handleBarangayChange,
  handleSubdivisionChange,
  handleStreetChange,
  updateResident,
}) => {
  const hasRegion = !!resident.regionId;
  const hasProvince = !!resident.provinceId;
  const hasMunicipality = !!resident.municipalityId;
  const hasBarangay = !!resident.barangayId;
  const hasSubdivision = !!resident.subdivisionId;
  const hasStreet = !!resident.streetId;

  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaMapMarkerAlt className="text-green-800" />
        Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Region (ALWAYS ENABLED) */}
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

        {/* Subdivision */}
        <ComboBoxFloatingLabel
          label="Subdivision / Village"
          options={subdivisionOptions}
          value={resident.subdivisionId}
          requireMatch
          disabled={!hasBarangay}
          onChange={handleSubdivisionChange}
        />

        {/* Street */}
        <ComboBoxFloatingLabel
          label="Street / Road"
          options={streetOptions}
          value={resident.streetId}
          requireMatch
          disabled={!hasSubdivision}
          onChange={handleStreetChange}
        />

        {/* Street Number */}
        <InputFloatingLabel
          label="Street Number / #"
          value={resident.streetNumber}
          disabled={!hasStreet}
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
