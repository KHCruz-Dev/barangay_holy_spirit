import {
  FaRegHospital,
  FaUserMd,
  FaHeartbeat,
  FaStethoscope,
  FaCheckCircle,
} from "react-icons/fa";
import { MdLocationOn, MdPeople } from "react-icons/md";
import HAWNow from "../../assets/images/hw-now.jpg";
import Goals from "../../assets/images/Goals.jpg";
import USEC from "../../assets/images/USEC.png";
import KAPITANA from "../../assets/images/KAPITANA.png";

const About = () => {
  return (
    <div className="p-8 space-y-10 max-w-5xl mx-auto text-gray-800">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-green-800">About the Program</h2>
        <p className="text-sm text-gray-600">
          Health and Wellness for Barangay Holy Spirit
        </p>
        <div className="w-24 mx-auto h-1 bg-green-800 rounded-full" />
      </div>

      {/* History Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-xl font-semibold text-green-700">
          Project History
        </h3>
        <p>
          The Health and Wellness Program was established by former DILG
          Undersecretary <strong>Felicito A. Valmocina</strong> during his term
          as Barangay Chairman. Today, it thrives under{" "}
          <strong>Chairwoman Estrella “Star” Valmocina</strong> and{" "}
          <strong>Councilor Dave Valmocina</strong>, extending support not only
          to residents of Quezon City but also neighboring provinces.
        </p>
      </section>

      {/* Services Offered */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-green-700">
          Services Offered
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Consultations",
            "X-rays",
            "2D Echo",
            "Ultrasound",
            "Detox",
            "Laboratory",
            "ECG",
            "Therapy",
            "Massage Therapy",
            "Electrotherapy",
          ].map((service) => (
            <div
              key={service}
              className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition"
            >
              <FaStethoscope className="text-green-700" />
              <span className="text-sm">{service}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Health and Wellness Now */}
      <section className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-xl font-semibold text-green-700">
          Health and Wellness Now
        </h3>
        <img
          src={HAWNow}
          alt="Health and Wellness Now"
          className="w-full rounded-xl shadow-md border border-gray-200 object-cover"
        />
        <p>
          <strong>Councilor Dave Valmocina</strong> leads modern initiatives to
          promote healthier lifestyles, preventive care, and mental wellness.
          His programs include medical missions, fitness events, and education
          campaigns to raise health awareness.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h4 className="text-lg font-bold text-green-700 mb-2">Vision</h4>
            <p>
              A healthy community in a clean and safe environment that ensures
              the full development of Filipino households into productive human
              resources.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h4 className="text-lg font-bold text-green-700 mb-2">Mission</h4>
            <p>
              To collaboratively uplift the quality of life for all, especially
              in Barangay Holy Spirit, making citizens physically, mentally,
              socially, and economically productive.
            </p>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="text-lg font-bold text-green-700 mb-4">Goals</h4>
          <img
            src={Goals}
            alt="Program Goals"
            className="w-full rounded-xl shadow-md border border-gray-200 object-cover"
          />
          <ul className="space-y-2 list-disc list-inside mt-4">
            {[
              "Provide free medical programs to seniors, PWDs, and marginalized individuals.",
              "Promote better health through modern technologies.",
              "Eliminate or reduce disease through interventions such as detox and organ checkups.",
              "Boost immune system and energy of individuals.",
              "Detect underlying illnesses early.",
            ].map((goal, index) => (
              <li key={index} className="flex items-start gap-2">
                <FaCheckCircle className="text-green-700 mt-1" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
