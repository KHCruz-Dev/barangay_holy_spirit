// src/components/TransactionsTable.jsx
import React, { useState } from "react";
import PatientModal from "./PatientModal";

import QRImage from "../../../../assets/images/Sample QR.png";
import ProfilePicture from "../../../../assets/images/sample-profile-pic.jpg";

const mockData = [
  {
    id: "TXN-001",
    fullName: "Juan Dela Cruz",
    birthdate: "1990-01-01",
    age: 34,
    contact: "+639123456789",
    email: "juan@example.com",
    precinct: "12345",
    voter: "Yes",
    civilStatus: "Single",
    nationality: "Filipino",
    gender: "Male",
    address: "Brgy. Holy Spirit",
    emergencyContact: "09112223344",
    bloodType: "O+",
    pwd: "No",
    fps4: "Yes",
    employed: true,
    student: false,
    pictureUrl: ProfilePicture,
    qrCodeUrl: QRImage,
    availedService: "Laboratory",
    queueNumber: 27,
    appointmentTime: "3:04pm",
    serviceStart: "4:00pm",
    serviceEnd: "5:00pm",
    appointmentDate: "August 23, 2025",
  },
  // Add more rows here
];

const TransactionsTable = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition duration-300">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Birthdate</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Voter</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">Employed</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((patient, index) => (
            <tr
              key={index}
              onClick={() => setSelectedPatient(patient)}
              className="group border-b transition duration-300 ease-in-out hover:shadow-md hover:shadow-blue-100 hover:bg-white hover:scale-[1.015] cursor-pointer"
            >
              <td className="px-4 py-3 group-hover:text-green-800 transition duration-300">
                {patient.fullName}
              </td>
              <td className="px-4 py-3">{patient.birthdate}</td>
              <td className="px-4 py-3">{patient.age}</td>
              <td className="px-4 py-3">{patient.contact}</td>
              <td className="px-4 py-3">{patient.voter}</td>
              <td className="px-4 py-3">{patient.gender}</td>
              <td className="px-4 py-3">{patient.employed ? "Yes" : "No"}</td>
              <td className="px-4 py-3 text-green-800 font-semibold group-hover:underline transition">
                View
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPatient && (
        <PatientModal
          isOpen={isModalOpen}
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
