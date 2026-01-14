import { FaUser } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";
import DateFloatingLabel from "../../../../Common/DateFloatingLabel";
import ComboBoxFloatingLabel from "../../../../Common/ComboFloatingLabel";

const PersonalInfoSection = ({
  resident,
  errors,
  handleBlur,
  updateResident,
  calculateAgeFromDate,

  prefixData,
  suffixData,
  gendersData,
  civilStatusData,
  nationalityData,
  bloodTypeData,

  showValidationSummary, // ✅ REQUIRED
  handleNameBlur,
}) => {
  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2">
        <FaUser className="text-green-800" />
        Personal Information
      </h3>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <ComboBoxFloatingLabel
              label="Prefix"
              options={prefixData}
              value={resident.prefix}
              onChange={updateResident("prefix")}
            />
          </div>

          <div className="md:col-span-3">
            <InputFloatingLabel
              label="First Name"
              value={resident.firstName}
              onChange={updateResident("firstName")}
              onBlur={() => handleNameBlur("firstName")}
              isInvalid={showValidationSummary && !!errors.firstName}
              errorMessage={showValidationSummary ? errors.firstName : ""}
            />
          </div>

          <div className="md:col-span-3">
            <InputFloatingLabel
              label="Middle Name"
              value={resident.middleName}
              onChange={updateResident("middleName")}
              onBlur={() => handleNameBlur("middleName")}
            />
          </div>

          <div className="md:col-span-3">
            <InputFloatingLabel
              label="Last Name"
              value={resident.lastName}
              onChange={updateResident("lastName")}
              onBlur={() => handleNameBlur("lastName")}
              isInvalid={showValidationSummary && !!errors.lastName}
              errorMessage={showValidationSummary ? errors.lastName : ""}
            />
          </div>

          <div className="md:col-span-3">
            <ComboBoxFloatingLabel
              label="Suffix"
              options={suffixData}
              value={resident.suffix}
              onChange={updateResident("suffix")}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <DateFloatingLabel
              label="Birthdate"
              value={resident.birthDate}
              onChange={(date) => {
                updateResident("birthDate")(date);
                updateResident("age")(calculateAgeFromDate(date).toString());
              }}
              onBlur={() => handleBlur("birthDate")}
              isInvalid={showValidationSummary && !!errors.birthDate}
              errorMessage={showValidationSummary ? errors.birthDate : ""}
            />
          </div>

          <div className="md:col-span-4">
            <InputFloatingLabel label="Age" value={resident.age} readOnly />
          </div>

          <div className="md:col-span-4">
            <ComboBoxFloatingLabel
              label="Gender"
              options={gendersData}
              value={resident.gender}
              onChange={updateResident("gender")}
              requireMatch
              onBlur={() => handleBlur("gender")}
              isInvalid={showValidationSummary && !!errors.gender}
              errorMessage={showValidationSummary ? errors.gender : ""}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <ComboBoxFloatingLabel
              label="Blood Type"
              options={bloodTypeData}
              value={resident.bloodType}
              onChange={updateResident("bloodType")}
            />
          </div>

          <div className="md:col-span-4">
            <ComboBoxFloatingLabel
              label="Civil Status"
              options={civilStatusData}
              value={resident.civilStatus}
              onChange={updateResident("civilStatus")}
              requireMatch
              onBlur={() => handleBlur("civilStatus")}
              isInvalid={showValidationSummary && !!errors.civilStatus}
              errorMessage={showValidationSummary ? errors.civilStatus : ""}
            />
          </div>

          <div className="md:col-span-4">
            <ComboBoxFloatingLabel
              label="Nationality"
              options={nationalityData}
              value={resident.nationality}
              onChange={updateResident("nationality")}
              requireMatch
              onBlur={() => handleBlur("nationality")}
              isInvalid={showValidationSummary && !!errors.nationality}
              errorMessage={showValidationSummary ? errors.nationality : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
