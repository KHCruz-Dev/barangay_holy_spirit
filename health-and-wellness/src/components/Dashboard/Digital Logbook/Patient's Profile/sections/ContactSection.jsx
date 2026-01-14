import { FaPhoneAlt } from "react-icons/fa";
import InputFloatingLabel from "../../../../Common/InputFloatingLabel";

const ContactSection = ({
  resident,
  errors,
  handleContactBlur, // ✅ FIXED
  updateResident,
}) => {
  return (
    <div className="bg-white shadow-sm p-6 border rounded-lg">
      <h3 className="text-gray-600 font-semibold text-sm mb-4 uppercase flex items-center gap-2">
        <FaPhoneAlt className="text-green-800" />
        Contact
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputFloatingLabel
          label="Contact Number (Enter 9 Digits)"
          value={resident.contactNumber || ""}
          onChange={updateResident("contactNumber")}
          onBlur={() => handleContactBlur("contactNumber")} // ✅ NOW WORKS
          isInvalid={!!errors.contactNumber}
          errorMessage={errors.contactNumber}
        />

        <InputFloatingLabel
          label="Email"
          value={resident.emailAddress || ""}
          onChange={updateResident("emailAddress")}
        />

        <InputFloatingLabel
          label="Emergency Contact Number (Enter 9 Digits)"
          value={resident.emergencyContactNumber || ""}
          onChange={updateResident("emergencyContactNumber")}
          onBlur={() => handleContactBlur("emergencyContactNumber")} // ✅ NOW WORKS
          isInvalid={!!errors.emergencyContactNumber}
          errorMessage={errors.emergencyContactNumber}
        />

        <InputFloatingLabel
          label="Emergency Contact Full Name"
          value={resident.emergencyContactFullName || ""}
          onChange={updateResident("emergencyContactFullName")}
        />
      </div>
    </div>
  );
};

export default ContactSection;
